!function(e){function t(r){if(n[r])return n[r].exports;var i=n[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,t),i.l=!0,i.exports}var n={};return t.m=e,t.c=n,t.i=function(e){return e},t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=13)}([function(e,t,n){"use strict";e.exports=function(){var e=[];return e.toString=function(){for(var e=[],t=0;t<this.length;t++){var n=this[t];n[2]?e.push("@media "+n[2]+"{"+n[1]+"}"):e.push(n[1])}return e.join("")},e.i=function(t,n){"string"==typeof t&&(t=[[null,t,""]]);for(var r={},i=0;i<this.length;i++){var o=this[i][0];"number"==typeof o&&(r[o]=!0)}for(i=0;i<t.length;i++){var a=t[i];"number"==typeof a[0]&&r[a[0]]||(n&&!a[2]?a[2]=n:n&&(a[2]="("+a[2]+") and ("+n+")"),e.push(a))}},e}},function(e,t){function n(e,t){for(var n=0;n<e.length;n++){var r=e[n],i=l[r.id];if(i){i.refs++;for(var o=0;o<i.parts.length;o++)i.parts[o](r.parts[o]);for(;o<r.parts.length;o++)i.parts.push(c(r.parts[o],t))}else{for(var a=[],o=0;o<r.parts.length;o++)a.push(c(r.parts[o],t));l[r.id]={id:r.id,refs:1,parts:a}}}}function r(e){for(var t=[],n={},r=0;r<e.length;r++){var i=e[r],o=i[0],a=i[1],s=i[2],c=i[3],u={css:a,media:s,sourceMap:c};n[o]?n[o].parts.push(u):t.push(n[o]={id:o,parts:[u]})}return t}function i(e,t){var n=g(),r=b[b.length-1];if("top"===e.insertAt)r?r.nextSibling?n.insertBefore(t,r.nextSibling):n.appendChild(t):n.insertBefore(t,n.firstChild),b.push(t);else{if("bottom"!==e.insertAt)throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");n.appendChild(t)}}function o(e){e.parentNode.removeChild(e);var t=b.indexOf(e);t>=0&&b.splice(t,1)}function a(e){var t=document.createElement("style");return t.type="text/css",i(e,t),t}function s(e){var t=document.createElement("link");return t.rel="stylesheet",i(e,t),t}function c(e,t){var n,r,i;if(t.singleton){var c=m++;n=v||(v=a(t)),r=u.bind(null,n,c,!1),i=u.bind(null,n,c,!0)}else e.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(n=s(t),r=d.bind(null,n),i=function(){o(n),n.href&&URL.revokeObjectURL(n.href)}):(n=a(t),r=f.bind(null,n),i=function(){o(n)});return r(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;r(e=t)}else i()}}function u(e,t,n,r){var i=n?"":r.css;if(e.styleSheet)e.styleSheet.cssText=y(t,i);else{var o=document.createTextNode(i),a=e.childNodes;a[t]&&e.removeChild(a[t]),a.length?e.insertBefore(o,a[t]):e.appendChild(o)}}function f(e,t){var n=t.css,r=t.media;if(r&&e.setAttribute("media",r),e.styleSheet)e.styleSheet.cssText=n;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(n))}}function d(e,t){var n=t.css,r=t.sourceMap;r&&(n+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(r))))+" */");var i=new Blob([n],{type:"text/css"}),o=e.href;e.href=URL.createObjectURL(i),o&&URL.revokeObjectURL(o)}var l={},p=function(e){var t;return function(){return"undefined"==typeof t&&(t=e.apply(this,arguments)),t}},h=p(function(){return/msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase())}),g=p(function(){return document.head||document.getElementsByTagName("head")[0]}),v=null,m=0,b=[];e.exports=function(e,t){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");t=t||{},"undefined"==typeof t.singleton&&(t.singleton=h()),"undefined"==typeof t.insertAt&&(t.insertAt="bottom");var i=r(e);return n(i,t),function(e){for(var o=[],a=0;a<i.length;a++){var s=i[a],c=l[s.id];c.refs--,o.push(c)}if(e){var u=r(e);n(u,t)}for(var a=0;a<o.length;a++){var c=o[a];if(0===c.refs){for(var f=0;f<c.parts.length;f++)c.parts[f]();delete l[c.id]}}}};var y=function(){var e=[];return function(t,n){return e[t]=n,e.filter(Boolean).join("\n")}}()},,,,function(e,t,n){var r=n(8);"string"==typeof r&&(r=[[e.i,r,""]]);n(1)(r,{});r.locals&&(e.exports=r.locals)},,,function(e,t,n){t=e.exports=n(0)(),t.push([e.i,"body,html{margin:0;padding:0;text-align:center}body,button{background-color:#fff;color:#334;font-family:monospace}#joystick,body,html{touch-action:none}#joystick{margin:0 auto;width:310px;height:310px;display:block;border:2px solid #334;border-radius:10px;background:-webkit-radial-gradient(circle closest-side,#fff,#ccd);background:radial-gradient(circle closest-side,#fff,#ccd)}h1{text-align:center;font-size:2rem}#tiltBtn{margin-top:1em;font-size:1.5rem;padding:1em 0;width:310px;border-radius:.5em;border-style:none;display:none;color:#fff;font-weight:700}#heading{width:310px;margin:1em auto;display:-webkit-box;display:flex;-webkit-box-pack:justify;justify-content:space-between;-webkit-box-align:baseline;align-items:baseline}.largetxt{font-size:2em}",""])},,,,,function(e,t,n){"use strict";n(5),window.addEventListener("load",function(){function e(){a.innerText=k?"☑ Tilt control":"☐ Tilt control",a.style.backgroundColor=k?"#0bf":"#ddd"}function t(){k?(b=x/20,y=-w/20):h||p?(b=v-c.offsetLeft-f/2,y=d/2-(m-c.offsetTop),b/=f/2,y/=d/2):(b=0,y=0),b=Math.min(Math.max(b,-1),1),y=Math.min(Math.max(y,-1),1)}function n(e,t){if(1===o.readyState){var n=new DataView(new ArrayBuffer(3));n.setUint8(0,0),n.setInt8(1,127*e),n.setInt8(2,127*t),o.send(n.buffer)}}function r(){t();var e=(b+1)/2*f,n=(-y+1)/2*d;l.lineWidth=10,l.clearRect(0,0,f,d),l.beginPath(),l.moveTo(f/2,d/2),l.lineTo(e,n),l.stroke(),l.lineWidth=2,l.beginPath(),l.arc(e,n,15,0,2*Math.PI),l.fill(),l.stroke(),window.requestAnimationFrame(r)}var i=function(e){return document.getElementById(e)},o=new WebSocket("ws://192.168.4.1/ws");o.binaryType="arraybuffer";var a=i("tiltBtn"),s=i("battery"),c=i("joystick"),u=window.devicePixelRatio,f=c.clientWidth,d=c.clientHeight;c.width=f*u,c.height=d*u;var l=c.getContext("2d");l.lineWidth=10,l.strokeStyle="black",l.fillStyle="red",l.scale(u,u);var p=!1,h=!1,g=null,v=0,m=0,b=0,y=0,w=0,x=0,L=!1,k=!1,T=function(e,t){for(var n=0;n<e.length;++n)if(e[n].identifier===t)return e[n];return null};o.addEventListener("message",function(e){var t=new DataView(e.data),n=t.getUint8(0);if(3===n&&3===e.data.byteLength){var r=t.getInt16(1,!0)/100;s.innerText=r.toFixed(2)}}),window.addEventListener("mousemove",function(e){p&&(v=e.pageX,m=e.pageY)}),c.addEventListener("mousedown",function(e){p=!0,v=e.pageX,m=e.pageY}),window.addEventListener("mouseup",function(e){p=!1}),c.addEventListener("touchstart",function(e){g=e.changedTouches[0].identifier,v=e.changedTouches[0].pageX,m=e.changedTouches[0].pageY,h=!0}),window.addEventListener("touchend",function(e){h&&null!==T(e.changedTouches,g)&&(h=!1)}),window.addEventListener("touchmove",function(e){var t=T(e.changedTouches,g);h&&null!==t&&(v=t.pageX,m=t.pageY)}),window.addEventListener("deviceorientation",function(t){null!==t.beta&&null!==t.gamma&&(L||(L=!0,a.style.display="inline",e()),w=t.beta,x=t.gamma)}),a.addEventListener("click",function(){k=!k,e()}),window.setInterval(function(){n(b,y)},100),window.requestAnimationFrame(r)})}]);