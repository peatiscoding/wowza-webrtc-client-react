import * as React from 'react';
import { WebRTCConfiguration } from 'wowza-webrtc-client';
import { IPublisher, WebRTCVideoStateChanged, CameraSource } from './IPublisher';
interface Props {
    id: string;
    style?: React.CSSProperties;
    trace?: boolean;
    streamName: string;
    className?: string;
    autoPreview: boolean;
    config: WebRTCConfiguration;
    usingCamera: CameraSource;
    showErrorOverlay: boolean;
    onVideoStateChanged?: WebRTCVideoStateChanged;
}
interface State {
    isCameraReady: boolean;
    isPreviewing: boolean;
    publisherError: Error | undefined;
}
export declare class WebRTCPublisher extends React.Component<Props, State> implements IPublisher {
    static defaultProps: Partial<Props>;
    private _localVideoRef;
    private handler;
    readonly isPreviewEnabled: boolean;
    stopPreview(): void;
    startPreview(): Promise<void>;
    tryToConnect(): Promise<void>;
    disconnect(): void;
    switchStream(cameraSource: CameraSource): void;
    private readonly videoElement;
    constructor(props: Props);
    componentDidMount(): Promise<void>;
    hold(hold: boolean): void;
    private statusInvalidated;
    render(): JSX.Element;
}
export {};
