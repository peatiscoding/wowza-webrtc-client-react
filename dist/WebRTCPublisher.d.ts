import * as React from 'react';
import { WebRTCConfiguration } from 'wowza-webrtc-client';
import { IPublisher, WebRTCVideoStateChanged, CameraSource } from './IPublisher';
interface Props {
    id: string;
    style?: React.CSSProperties;
    trace?: boolean;
    className?: string;
    autoPreview: boolean;
    config: WebRTCConfiguration;
    usingCamera: CameraSource;
    showErrorOverlay: boolean;
    enhanceMode: 'auto' | boolean;
    videoCodec: 'H264' | 'VPX';
    onVideoStateChanged?: WebRTCVideoStateChanged;
}
interface State {
    streamName?: string;
    isCameraReady: boolean;
    isPreviewing: boolean;
    publisherError: Error | undefined;
}
export declare class WebRTCPublisher extends React.Component<Props, State> implements IPublisher {
    static defaultProps: Partial<Props>;
    private _localVideoRef;
    private handler;
    reconfig(config: WebRTCConfiguration): void;
    readonly isPreviewEnabled: boolean;
    stopPreview(): void;
    startPreview(): Promise<void>;
    publish(streamName: string): Promise<void>;
    disconnect(): void;
    switchStream(cameraSource: CameraSource): void;
    private readonly videoElement;
    constructor(props: Props);
    componentDidUpdate(prevProps: Props): void;
    componentDidMount(): Promise<void>;
    hold(hold: boolean): void;
    /**
     * connect method invoke from within Publisher component built-in UI.
     */
    private retry;
    private statusInvalidated;
    render(): JSX.Element;
}
export {};
