import * as React from 'react'
import { WebRTCPlayer as Player, WebRTCConfiguration } from 'wowza-webrtc-client'
import { IPlayerProps, IPlayer } from './IPlayer'

interface Props extends IPlayerProps {
  id: string
  style?: React.CSSProperties,      // Html CSS Properties
  streamName?: string
  videoRatio: number
  disableAudio: boolean
  autoPlay: boolean
  rotate: 'none'|'ccw'|'cw'|'flip'
  sizing: 'cover'|'contain'
  config: WebRTCConfiguration
  showUnmuteButton: boolean
  showErrorOverlay: boolean
  className: string
}

interface State {
  loadCount: number
  isMuted?: boolean
  isPlaying: boolean
  error?: Error
  videoStyle: React.CSSProperties
}

export class WebRTCPlayer extends React.Component<Props, State> implements IPlayer {

  public static defaultProps: Partial<Props> = {
    disableAudio: false,
    autoPlay: true,
    rotate: 'none',
    showUnmuteButton: true,
    showErrorOverlay: true,
    className: '',
    sizing: 'contain'
  }

  public get isPlaying(): boolean {
    return this.playerInterface && this.playerInterface.isPlaying || false
  }

  private get videoElement(): HTMLVideoElement {
    return (this.refs as any).video
  }

  private get frameElement(): HTMLDivElement {
    return (this.refs as any).frame
  }

  private playerInterface?: Player

  private resizeHandler!: () => void

  constructor(props: Props) {
    super(props)
    this.state = {
      loadCount: 0,
      isPlaying: false,
      videoStyle: {
        width: '100%',
        height: '100%'
      }
    }
  }

  componentDidMount() {
    this._initPlayer(this.props.autoPlay)

    // register a resize handler.
    this.resizeHandler = () => {
      //
      const videoSize = {
        width: this.videoElement.videoWidth,
        height: this.videoElement.videoHeight
      }
      let frameSize = {
        width: this.frameElement.clientWidth,
        height: this.frameElement.clientHeight
      }
      if (!(videoSize.width > 0 && videoSize.height >0) || !frameSize) {
        console.log('Bailed on calculation size info is not valid')
        return
      }
      if (videoSize && frameSize) {
        // perform calculation
        const videoAspectRatio = videoSize.width / videoSize.height
        let outState: React.CSSProperties = {
          position: 'absolute',
        }
        // (1) Placement
        if (/(cw)/.test(this.props.rotate)) {
          frameSize = {
            height: frameSize.width,
            width: frameSize.height
          }
        }
        const frameAspectRatio = frameSize.width / frameSize.height
        let actualVideoSize: { width: number, height: number } = { width: 0, height: 0 }
        console.log(`Input (s=${this.props.sizing}, v, f) = ratios[`, videoAspectRatio, frameAspectRatio, '] frame[', videoSize, frameSize, ']')

        // width dominate is based on given associated sizing option.
        if (this.props.sizing === 'contain' && videoAspectRatio > frameAspectRatio
          || this.props.sizing === 'cover' && videoAspectRatio < frameAspectRatio) {
          // width dominate
          console.log(`Width dominate ...`, videoAspectRatio, frameAspectRatio)
          actualVideoSize = {
            width: frameSize.width,
            height: frameSize.width / videoAspectRatio
          }
          outState = {
            ...outState,
            width: `${actualVideoSize.width}px`,
            left: '0',
            top: `${frameSize.height/2 - actualVideoSize.height/2}px`,
          }
        } else {
          // height dominate
          console.log(`Height dominate ...`, videoAspectRatio, frameAspectRatio)
          actualVideoSize = {
            width: frameSize.height * videoAspectRatio,
            height: frameSize.height
          }
          outState = {
            ...outState,
            height: `${actualVideoSize.height}px`,
            top: '0',
            left: `${frameSize.width/2 - actualVideoSize.width/2}px`,
          }
        }
        // (2) Offset Tweak
        if (/(cw)/.test(this.props.rotate)) {
          // left/top offset need to be adjusted accordingly.
          // Flip back
          frameSize = {
            height: frameSize.width,
            width: frameSize.height
          }
          outState.top = (frameSize.height - actualVideoSize.height) / 2
          outState.left = (frameSize.width - actualVideoSize.width) / 2
        }
        if (this.props.rotate === 'ccw') {
          outState.transform = 'rotate(-90deg)'
        } else if (this.props.rotate === 'cw') {
          outState.transform = 'rotate(90deg)'
        } else if (this.props.rotate === 'flip') {
          outState.transform = 'rotate(180deg)'
        }
        this.setState({
          videoStyle: outState
        })
      }
    }

    this.resizeHandler()

    window.addEventListener('resize', this.resizeHandler)
  }

  componentWillUnmount() {
    // unregister a resize handler.
    window.removeEventListener('resize', this.resizeHandler)
  }

  private _initPlayer(autoPlay: boolean) {
    // Create a new instance
    this.playerInterface = new Player(this.props.config, this.videoElement, ({ isMuted, isPlaying, error }) => {
      this.setState({ isMuted, isPlaying, error })
      this.props.onPlayerStateChanged && this.props.onPlayerStateChanged({ isMuted, isPlaying, error })
      this.resizeHandler && this.resizeHandler()
    })
    if (autoPlay) {
      setTimeout(this.play.bind(this), 3000)
    }
  }

  public play() {
    const streamName = this.props.streamName
    if (!streamName) {
      throw new Error('Stream Name is required.')
    }
    this.playerInterface && this.playerInterface.connect(streamName)
  }

  public stop() {
    this.playerInterface && this.playerInterface.stop()
  }

  render() {
    return <div id={ this.props.id } 
        ref="frame" 
        style={{ ...this.props.style }}
        className={`webrtc-player ${this.props.sizing} ${this.props.className}`}>
      <video ref="video" playsInline autoPlay
        className={this.props.rotate} 
        style={this.state.videoStyle}
        />
      {
        this.playerInterface && this.state.isMuted &&
        <div className="unmute-blocker d-flex justify-content-center align-items-center" onClick={() => this.playerInterface && (this.playerInterface.isMuted = false) }>
          { this.props.children }
          {
            this.props.showUnmuteButton && 
            <button className="btn btn-danger"><i className="fas fa-volume-mute"></i> TAP TO UNMUTE</button>
          }
        </div>
      }
      {
        this.state.error &&
        <div className="unmute-blocker d-flex justify-content-center align-items-center">
          {
            this.props.showErrorOverlay &&
            <p className="text-danger text-center">{`${this.state.error.message}`}<br/>Tap to retry.</p>
          }
        </div>
      }
    </div>
  }
}