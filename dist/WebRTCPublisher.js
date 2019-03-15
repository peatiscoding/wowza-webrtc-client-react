"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var wowza_webrtc_client_1 = require("wowza-webrtc-client");
var WebRTCPublisher = /** @class */ (function (_super) {
    __extends(WebRTCPublisher, _super);
    function WebRTCPublisher(props) {
        var _this = 
        // Properties
        // - Assign default values to props.
        _super.call(this, props) || this;
        // States declaration
        // - No states is required at this point.
        _this.state = {
            isCameraReady: false
        };
        // so `statusInvalidated` can be called without bindings.
        _this.statusInvalidated = _this.statusInvalidated.bind(_this);
        // Create WebProducer object.
        _this.handler = new wowza_webrtc_client_1.WebRTCPublisher(_this.props.config, _this.statusInvalidated);
        return _this;
    }
    Object.defineProperty(WebRTCPublisher.prototype, "isPreviewEnabled", {
        get: function () {
            return this.handler.isPreviewEnabled;
        },
        enumerable: true,
        configurable: true
    });
    WebRTCPublisher.prototype.stopPreview = function () {
        this.handler.detachUserMedia();
    };
    WebRTCPublisher.prototype.startPreview = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.handler.attachUserMedia(this._localVideoRef)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    WebRTCPublisher.prototype.tryToConnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.isPreviewEnabled) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.handler.attachUserMedia(this._localVideoRef)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        this.handler.connect(this.props.streamName);
                        return [2 /*return*/];
                }
            });
        });
    };
    WebRTCPublisher.prototype.disconnect = function () {
        this.handler.disconnect();
    };
    Object.defineProperty(WebRTCPublisher.prototype, "_localVideoRef", {
        get: function () {
            return this.refs.localVideo;
        },
        enumerable: true,
        configurable: true
    });
    WebRTCPublisher.prototype.componentDidMount = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // localVideo is now ready (as it is mounted)
                if (this.state.isCameraReady && this.props.autoPreview) {
                    this.handler.attachUserMedia(this._localVideoRef);
                }
                return [2 /*return*/];
            });
        });
    };
    WebRTCPublisher.prototype.hold = function (hold) {
        this.handler.isHolding = hold;
    };
    WebRTCPublisher.prototype.statusInvalidated = function () {
        // Update local states
        this.setState({
            isCameraReady: !this.handler.isCameraMuted
        });
        // dispatch update to exterior state handler
        this.props.onVideoStateChanged && this.props.onVideoStateChanged({
            isCameraReady: !this.handler.isCameraMuted,
            isHolding: this.handler.isHolding,
            isPublishing: this.handler.isPublishing,
            isPreviewEnabled: this.isPreviewEnabled,
            publisherError: this.handler.lastError
        });
    };
    WebRTCPublisher.prototype.render = function () {
        return (React.createElement("video", { id: this.props.id, className: "webrtc-publisher " + this.props.className + " " + (this.state.isCameraReady ? '' : 'disabled'), ref: "localVideo", playsInline: true, muted: true, controls: false, autoPlay: true, style: this.props.style }));
    };
    WebRTCPublisher.defaultProps = {
        trace: true,
        autoPreview: true
    };
    return WebRTCPublisher;
}(React.Component));
exports.WebRTCPublisher = WebRTCPublisher;
