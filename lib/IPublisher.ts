export type CameraSource = 'user'|'environment'|'any'

export interface IPublisherStatus {
  isHolding: boolean
  isCameraReady: boolean
  isPublishing: boolean
  isPreviewEnabled: boolean
  publisherError: Error|undefined
}

export interface WebRTCPublisherStatus extends IPublisherStatus {
  usingCamera: CameraSource
}

export type IVideoStateChanged = (status: IPublisherStatus) => void

export type WebRTCVideoStateChanged = (status: WebRTCPublisherStatus) => void

export interface IPublisher {

  hold(value: boolean): void

  publish(streamName: string): Promise<void>

  disconnect(): void
}