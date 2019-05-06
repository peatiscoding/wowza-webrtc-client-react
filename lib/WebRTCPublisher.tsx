import * as React from 'react'
import { WebRTCConfiguration, WebRTCPublisher as PublisherHandler } from 'wowza-webrtc-client'
import { IPublisher, WebRTCVideoStateChanged, CameraSource } from './IPublisher'

const cameraSourceToConstraints = (src: CameraSource): MediaStreamConstraints => {
  return {
    audio: true,
    video: src === 'any' ? true : { facingMode: { exact: src }}
  }
}

const constraintsToCameraSource = (from: MediaStreamConstraints): CameraSource => {
  if (from.video === true) {
    return 'any'
  }
  const json = JSON.stringify(from.video)
  return /environment/.test(json) ? 'environment' : 'user'
}

interface Props {
  id: string,                       // Html DOM's id
  style?: React.CSSProperties,      // Html CSS Properties
  trace?: boolean                   // Enable Logs in Console?
  streamName: string                // Publishing stream name
  className?: string
  autoPreview: boolean              // start preview when tryToConnect(), stop preview on disconnect()
  config: WebRTCConfiguration
  usingCamera: CameraSource
  showErrorOverlay: boolean
  onVideoStateChanged?: WebRTCVideoStateChanged
}

interface State {
  isCameraReady: boolean
  isPreviewing: boolean
  publisherError: Error|undefined
}

export class WebRTCPublisher extends React.Component<Props, State> implements IPublisher {

  public static defaultProps: Partial<Props> = {
    trace: true,
    autoPreview: true,
    showErrorOverlay: true,
    usingCamera: 'any'
  }

  private _localVideoRef = React.createRef<HTMLVideoElement>()

  private handler!: PublisherHandler

  public get isPreviewEnabled(): boolean {
    return this.state.isPreviewing
  }

  public stopPreview() {
    this.handler.detachUserMedia()
  }

  public async startPreview() {
    if (this.videoElement) {
      await this.handler.attachUserMedia(this.videoElement)
    }
  }

  public async tryToConnect(): Promise<void> {
    if (!this.isPreviewEnabled && this.videoElement) {
      await this.handler.attachUserMedia(this.videoElement)
    }
    this.handler.connect(this.props.streamName)
  }

  public disconnect() {
    this.handler.disconnect()
    if (this.isPreviewEnabled && this.props.autoPreview) {
      this.handler.detachUserMedia()
    }
  }

  public switchStream(cameraSource: CameraSource) {
    this.handler.switchStream({
      audio: true,
      video: { facingMode: { exact: cameraSource } }
    })
    this.statusInvalidated()
  }

  private get videoElement(): HTMLVideoElement|undefined {
    return this._localVideoRef.current || undefined
  }

  constructor(props: Props) {
    // Properties
    // - Assign default values to props.
    super(props)

    // States declaration
    // - No states is required at this point.
    this.state = {
      isCameraReady: false,
      isPreviewing: false,
      publisherError: undefined
    }

    // so `statusInvalidated` can be called without bindings.
    this.statusInvalidated = this.statusInvalidated.bind(this)

    // Create WebProducer object.
    this.handler = new PublisherHandler(
      this.props.config,
      cameraSourceToConstraints(props.usingCamera),
      this.statusInvalidated
    )
  }

  async componentDidMount() {
    // localVideo is now ready (as it is mounted)
    if (this.state.isCameraReady && this.props.autoPreview && this.videoElement) {
      this.handler.attachUserMedia(this.videoElement)
    }
  }

  public hold(hold: boolean) {
    this.handler.isHolding = hold
  }

  private statusInvalidated() {
    // Update local states
    this.setState({
      isCameraReady: !this.handler.isCameraMuted,
      isPreviewing: this.handler.isPreviewEnabled,
      publisherError: this.handler.lastError
    })
    // dispatch update to exterior state handler
    this.props.onVideoStateChanged && this.props.onVideoStateChanged({
      isCameraReady: !this.handler.isCameraMuted,
      isHolding: this.handler.isHolding,
      isPublishing: this.handler.isPublishing,
      isPreviewEnabled: this.isPreviewEnabled,
      publisherError: this.handler.lastError,
      usingCamera: constraintsToCameraSource(this.handler.streamSourceConstraints)
    })
  }

  render() {
    return <div className={`webrtc-publisher ${this.props.className} ${this.state.isPreviewing ? 'previewing': '' } ${this.state.isCameraReady ? '' : 'disabled'}`}>
      <video 
        id={this.props.id}
        ref={this._localVideoRef}
        playsInline={true}
        muted={true}
        controls={false}
        autoPlay={true}
        style={{height: '100%', width: '100%', ...this.props.style}} />
      {
        this.state.publisherError &&
        <div className="unmute-blocker d-flex justify-content-center align-items-center"
            onClick={this.tryToConnect.bind(this)}>
          {
            this.props.showErrorOverlay &&
            <p className="text-danger text-center">
              {`${this.state.publisherError.message}`}<br/><br/>
              <button className="btn btn-danger"><i className="fas redo-alt"></i> TAP TO RECONNECT</button>
            </p>
          }
        </div>
      }
    </div>
  }
}