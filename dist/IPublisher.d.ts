export interface IPublisherStatus {
    isHolding: boolean;
    isCameraReady: boolean;
    isPublishing: boolean;
    isPreviewEnabled: boolean;
    publisherError: Error | undefined;
}
export declare type IVideoStateChanged = (status: IPublisherStatus) => void;
export interface IPublisher {
    hold(value: Boolean): void;
    tryToConnect(): Promise<void>;
    disconnect(): void;
}
export interface IPublisherProps {
    onVideoStateChanged?: IVideoStateChanged;
}
