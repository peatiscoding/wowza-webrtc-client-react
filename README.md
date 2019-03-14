# WoWZA WebRTC Client React Components

## To install

Using NPM

```sh
npm i wowza-webrtc-client-react
```

or yarn

```sh
yarn add wowza-webrtc-client-react
```

## Usage

**Prepare Configuration**

```ts
import { WebRTCConfiguration } from 'wowza-webrtc-client'

const config: WebRTCConfiguration =  {
  WEBRTC_SDP_URL: 'wss://my-domain.streamlock.net/webrtc-session.json',
  WEBRTC_APPLICATION_NAME: 'myWebRTCApp',
  WEBRTC_FRAME_RATE: 29,
  WEBRTC_AUDIO_BIT_RATE: 64,
  WEBRTC_VIDEO_BIT_RATE: 360,
}
```

**For Publishing**

```jsx
import { WebRTCPublisher as Publisher } from 'wowza-webrtc-client-react'

<Publisher id="publisher-test"
  ref="publisher"
  className="d-block"
  streamName="my-stream-name"
  style={{ width: '100%', height: '100%'}}
  config={ config }
  onVideoStateChanged={(state) => {
    console.log('Publisher state has changed', state)
  }}
/>
```

**For Playing**

```jsx
import { WebRTCPlayer as Player } from 'wowza-webrtc-client-react'

<Player
  id="player-test"
  ref="player"
  streamName="my-stream-name"
  style={{ width: '100%', height: '100vh'}}
  rotate="cw"   // 'cw'|'none'|'ccw'
  config={ config }
  autoPlay={false}
  onPlayerStateChanged={(status) => {
    console.log('Player state has changed', status)
  }}/>
```
