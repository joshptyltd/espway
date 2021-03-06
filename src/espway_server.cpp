/*
 * Firmware for a segway-style robot using ESP8266.
 * Copyright (C) 2017  Sakari Kapanen
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

#include <string.h>
#include <espressif/esp_common.h>
#include <lwip/tcpip.h>

#include "espway.h"

#define BATTERY_COEFFICIENT FLT_TO_Q16(100.0f / BATTERY_CALIBRATION_FACTOR)

static void websocket_save_config(struct tcp_pcb *pcb)
{
  uint8_t response;
  if (save_flash_config())
  {
    response = RES_SAVE_CONFIG_SUCCESS;
  }
  else
  {
    response = RES_SAVE_CONFIG_FAILURE;
  }
  websocket_write(pcb, &response, 1, WS_BIN_MODE);
}

static bool websocket_clear_config(struct tcp_pcb *pcb)
{
  uint8_t response;
  // Clear the configuration by writing config version zero
  bool success = clear_flash_config();
  if (success)
  {
    response = RES_CLEAR_CONFIG_SUCCESS;
    load_hardcoded_config();
  }
  else
  {
    response = RES_CLEAR_CONFIG_FAILURE;
  }
  websocket_write(pcb, &response, 1, WS_BIN_MODE);
  return success;
}

static void send_pid_params(struct tcp_pcb *pcb, pid_controller_index idx)
{
  uint8_t buf[14];
  buf[0] = RES_PID_PARAMS;
  buf[1] = idx;
  int32_t *params = (int32_t *)(&buf[2]);
  xSemaphoreTake(pid_mutex, portMAX_DELAY);
  params[0] = my_config.pid_coeffs_arr[idx].p;
  params[1] = my_config.pid_coeffs_arr[idx].i;
  params[2] = my_config.pid_coeffs_arr[idx].d;
  xSemaphoreGive(pid_mutex);
  websocket_write(pcb, buf, sizeof(buf), WS_BIN_MODE);
}

static void send_gravity(struct tcp_pcb *pcb, const vector3d_fix * const grav)
{
  uint8_t buf[7];
  buf[0] = RES_GRAVITY;
  int16_t *qdata = (int16_t *)&buf[1];
  xSemaphoreTake(orientation_mutex, portMAX_DELAY);
  qdata[0] = grav->x / 2;
  qdata[1] = grav->y / 2;
  qdata[2] = grav->z / 2;
  xSemaphoreGive(orientation_mutex);
  websocket_write(pcb, buf, sizeof(buf), WS_BIN_MODE);
}

static void websocket_cb(struct tcp_pcb *pcb, uint8_t *data, uint16_t data_len, uint8_t mode)
{
  if (data_len == 0 || mode != WS_BIN_MODE) return;

  uint8_t msgtype = data[0];
  uint8_t *payload = &data[1];
  data_len -= 1;
  int8_t *signed_data;
  pid_controller_index pid_index;
  int32_t *i32_data;
  uint8_t res;

  switch (msgtype)
  {
    case STEERING:
      // Parameters: velocity (int8_t), turn rate (int8_t)
      if (data_len != 2) break;
      signed_data = (int8_t *)payload;
      steering_bias = (FLT_TO_Q16(STEERING_FACTOR) * signed_data[0]) / 128;
      target_speed = (FLT_TO_Q16(SPEED_CONTROL_FACTOR) * signed_data[1]) / 128;
      xTaskNotify(xSteeringWatcher, 0, eNoAction);
      break;

    case REQ_GRAVITY:
      if (data_len != 0) break;
      //send_gravity(pcb, &gravity);
      break;

    case REQ_SET_PID_PARAMS:
      // Parameters: pid index (uint8_t), P (q16/int32_t), I (q16), D (q16)
      if (data_len != 13) break;

      pid_index = (pid_controller_index)payload[0];
      i32_data = (int32_t *)(&payload[1]);
      if (pid_index < (sizeof(pid_settings_arr) / sizeof(pid_settings_arr[0])))
      {
        update_pid_controller(pid_index, i32_data[0], i32_data[1],
            i32_data[2]);
        res = RES_SET_PID_PARAMS_ACK;
        websocket_write(pcb, &res, 1, WS_BIN_MODE);
      }

      break;

    case REQ_GET_PID_PARAMS:
      if (data_len != 1) break;
      if (payload[0] < (sizeof(pid_settings_arr) / sizeof(pid_settings_arr[0])))
      {
        send_pid_params(pcb, (pid_controller_index)payload[0]);
      }
      break;

    case REQ_LOAD_FLASH_CONFIG:
      if (data_len != 0) break;
      load_config();
      res = RES_LOAD_FLASH_CONFIG_DONE;
      websocket_write(pcb, &res, 1, WS_BIN_MODE);
      break;

    case REQ_SAVE_CONFIG:
      if (data_len != 0) break;
      websocket_save_config(pcb);
      break;

    case REQ_CLEAR_CONFIG:
      if (data_len != 0) break;
      websocket_clear_config(pcb);
      break;
  }
}

TaskHandle_t xBatteryTask;
static void battery_task(void *pvParameter)
{
  struct tcp_pcb *pcb = NULL;
  q16 battery_value = 0;
  for (;;)
  {
    battery_value = q16_exponential_smooth(battery_value, sdk_system_adc_read(),
        FLT_TO_Q16(0.25f));

    if (ENABLE_BATTERY_CUTOFF && battery_value < (unsigned int)(BATTERY_THRESHOLD * BATTERY_CALIBRATION_FACTOR))
    {
      battery_cutoff();
      break;
    }

    vTaskDelay(BATTERY_CHECK_INTERVAL / portTICK_PERIOD_MS);

    uint32_t notification_value = 0;
    if (xTaskNotifyWait(0, 0, &notification_value, 0))
    {
      pcb = (struct tcp_pcb *)notification_value;
    }

    LOCK_TCPIP_CORE();
    if (pcb != NULL && pcb->state == ESTABLISHED)
    {
      uint8_t buf[3];
      buf[0] = BATTERY;
      uint16_t *payload = (uint16_t *)&buf[1];
      payload[0] = q16_mul(battery_value, BATTERY_COEFFICIENT);
      websocket_write(pcb, buf, sizeof(buf), WS_BIN_MODE);
    }
    UNLOCK_TCPIP_CORE();
  }

  vTaskDelete(NULL);
}

static void websocket_open_cb(struct tcp_pcb *pcb, const char *uri)
{
  if (strcmp(uri, "/ws") == 0)
  {
    xTaskNotify(xBatteryTask, (uint32_t)pcb, eSetValueWithOverwrite);
  }
}

void httpd_task(void *pvParameters)
{
  xTaskCreate(&battery_task, "Battery task", 256, NULL, uxTaskPriorityGet(NULL), &xBatteryTask);

  tCGI pCGIs[] = {
    {"/pid", (tCGIHandler)([](int, int, char *[], char *[])
        { return "/pid.html"; })}
  };
  http_set_cgi_handlers(pCGIs, sizeof (pCGIs) / sizeof (pCGIs[0]));

  websocket_register_callbacks((tWsOpenHandler) websocket_open_cb,
      (tWsHandler) websocket_cb);
  httpd_init();

  for (;;);
}
