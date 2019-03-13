export interface IPlayerStatus {
  isMuted?: boolean
  isPlaying: boolean
  error?: Error
}

type PlayerStateChanged = (status: IPlayerStatus) => void

export interface IPlayerProps {
  streamName?: string
  disableAudio: boolean
  autoPlay: boolean
  onPlayerStateChanged?: PlayerStateChanged
}

export interface IPlayer {

  /**
   * Allow user to start playing the media.
   */
  play(): void

  /**
   * Allow user to stop playing.
   */
  stop(): void

  /**
   * Player error.
   */
  error?: Error
}