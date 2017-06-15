#include <string.h>

#include <espressif/esp_common.h>
#include <esp/uart.h>
#include <dhcpserver.h>

#define AP_SSID "ESPway"

void wifi_setup(void) {
    sdk_wifi_set_opmode(SOFTAP_MODE);
    struct ip_info ap_ip;
    IP4_ADDR(&ap_ip.ip, 192, 168, 0, 1);
    IP4_ADDR(&ap_ip.gw, 0, 0, 0, 0);
    IP4_ADDR(&ap_ip.netmask, 255, 255, 255, 0);
    sdk_wifi_set_ip_info(1, &ap_ip);

    struct sdk_softap_config ap_config = {};
    strcpy((char *)ap_config.ssid, AP_SSID);
    ap_config.channel = 3;
    ap_config.ssid_len = strlen(AP_SSID);
    ap_config.authmode = AUTH_OPEN;
    ap_config.max_connection = 1;
    ap_config.beacon_interval = 100;
    sdk_wifi_softap_set_config(&ap_config);

    ip_addr_t first_client_ip;
    IP4_ADDR(&first_client_ip, 192, 168, 0, 2);
    dhcpserver_start(&first_client_ip, 4);
}

extern "C" void user_init(void)
{
    uart_set_baud(0, 115200);
    wifi_setup();
}

