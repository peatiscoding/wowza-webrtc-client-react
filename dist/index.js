"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var wowza_webrtc_client_1 = require("wowza-webrtc-client");
exports.getUserMedia = wowza_webrtc_client_1.getUserMedia;
exports.supportGetUserMedia = wowza_webrtc_client_1.supportGetUserMedia;
exports.isMobileBrowser = wowza_webrtc_client_1.isMobileBrowser;
exports.queryForCamera = wowza_webrtc_client_1.queryForCamera;
__export(require("./WebRTCPlayer"));
__export(require("./WebRTCPublisher"));
