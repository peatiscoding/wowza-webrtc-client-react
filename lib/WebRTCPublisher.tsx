import * as React from 'react'
import { WebRTCConfiguration, WebRTCPublisher as PublisherHandler } from 'wowza-webrtc-client'
import { IPublisher, IPublisherProps } from './IPublisher'

interface Props extends IPublisherProps {
  id: string,                       // Html DOM's id
  style?: React.CSSProperties,      // Html CSS Properties
  trace?: boolean                   // Enable Logs in Console?
  streamName: string                // Publishing stream name
  className?: string
  autoPreview: boolean
  config: WebRTCConfiguration
}

interface State {
  isCameraReady: boolean
}

export class WebRTCPublisher extends React.Component<Props, State> implements IPublisher {

  public static defaultProps: Partial<Props> = {
    trace: true,
    autoPreview: true
  }

  private handler!: PublisherHandler

  public get isPreviewEnabled(): boolean {
    return this.handler.isPreviewEnabled
  }

  public stopPreview() {
    this.handler.detachUserMedia()
  }

  public async startPreview() {
    await this.handler.attachUserMedia(this._localVideoRef)
  }

  public async tryToConnect(): Promise<void> {
    if (!this.isPreviewEnabled) {
      await this.handler.attachUserMedia(this._localVideoRef)
    }
    this.handler.connect(this.props.streamName)
  }

  public disconnect() {
    this.handler.disconnect()
  }

  private get _localVideoRef(): HTMLVideoElement {
    return (this.refs as any).localVideo
  }

  constructor(props: Props) {
    // Properties
    // - Assign default values to props.
    super(props)

    // States declaration
    // - No states is required at this point.
    this.state = {
      isCameraReady: false
    }

    // so `statusInvalidated` can be called without bindings.
    this.statusInvalidated = this.statusInvalidated.bind(this)

    // Create WebProducer object.
    this.handler = new PublisherHandler(this.props.config, this.statusInvalidated)
  }

  async componentDidMount() {
    // localVideo is now ready (as it is mounted)
    if (this.state.isCameraReady && this.props.autoPreview) {
      this.handler.attachUserMedia(this._localVideoRef)
    }
  }

  public hold(hold: boolean) {
    this.handler.isHolding = hold
  }

  private statusInvalidated() {
    // Update local states
    this.setState({
      isCameraReady: !this.handler.isCameraMuted
    })
    // dispatch update to exterior state handler
    this.props.onVideoStateChanged && this.props.onVideoStateChanged({
      isCameraReady: !this.handler.isCameraMuted,
      isHolding: this.handler.isHolding,
      isPublishing: this.handler.isPublishing,
      isPreviewEnabled: this.isPreviewEnabled,
      publisherError: this.handler.lastError
    })
  }

  render() {
    return (
      <video 
        id={this.props.id}
        className={`webrtc-publisher ${this.props.className} ${this.state.isCameraReady ? '' : 'disabled'}`}
        ref="localVideo"
        playsInline={true}
        muted={true}
        controls={false}
        autoPlay={true}
        style={this.props.style} />
    );
  }
}