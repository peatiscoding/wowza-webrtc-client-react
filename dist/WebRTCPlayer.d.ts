import * as React from 'react';
import { WebRTCConfiguration } from 'wowza-webrtc-client';
import { IPlayerProps, IPlayer } from './IPlayer';
interface Props extends IPlayerProps {
    id: string;
    style?: React.CSSProperties;
    streamName?: string;
    videoRatio: number;
    disableAudio: boolean;
    autoPlay: boolean;
    rotate: 'none' | 'ccw' | 'cw' | 'flip';
    sizing: 'cover' | 'contain';
    config: WebRTCConfiguration;
    showUnmuteButton: boolean;
    showErrorOverlay: boolean;
    className: string;
}
interface State {
    loadCount: number;
    isMuted?: boolean;
    isPlaying: boolean;
    error?: Error;
    videoStyle: React.CSSProperties;
}
export declare class WebRTCPlayer extends React.Component<Props, State> implements IPlayer {
    static defaultProps: Partial<Props>;
    readonly isPlaying: boolean;
    private readonly videoElement;
    private readonly frameElement;
    private playerInterface?;
    private resizeHandler;
    private _refFrame;
    private _refVideo;
    constructor(props: Props);
    componentDidMount(): void;
    componentWillUnmount(): void;
    private _initPlayer;
    play(): void;
    stop(): void;
    render(): JSX.Element;
}
export {};
