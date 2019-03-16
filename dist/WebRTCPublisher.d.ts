import * as React from 'react';
import { WebRTCConfiguration } from 'wowza-webrtc-client';
import { IPublisher, IPublisherProps } from './IPublisher';
interface Props extends IPublisherProps {
    id: string;
    style?: React.CSSProperties;
    trace?: boolean;
    streamName: string;
    className?: string;
    autoPreview: boolean;
    config: WebRTCConfiguration;
}
interface State {
    isCameraReady: boolean;
    isPreviewing: boolean;
}
export declare class WebRTCPublisher extends React.Component<Props, State> implements IPublisher {
    static defaultProps: Partial<Props>;
    private handler;
    readonly isPreviewEnabled: boolean;
    stopPreview(): void;
    startPreview(): Promise<void>;
    tryToConnect(): Promise<void>;
    disconnect(): void;
    private readonly _localVideoRef;
    constructor(props: Props);
    componentDidMount(): Promise<void>;
    hold(hold: boolean): void;
    private statusInvalidated;
    render(): JSX.Element;
}
export {};
