/*
Test Room component

https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling

To do:
- Close peer connection correctly
*/
 
import React, { useContext, useRef} from 'react'
import { SocketContext } from '../context/socket';

const Room: React.FC = () => {
  const socket = useContext(SocketContext);

  const streamRef = useRef<HTMLVideoElement|null>(null);
  const remoteStreamRef = useRef<HTMLVideoElement|null>(null);

  let myPeerConnection: RTCPeerConnection;    // RTCPeerConnection
  let webcamStream: MediaStream;        // MediaStream from webcam

  const mediaConstraints = {
    audio: true,
    video: { width: 300, height: 150 }
  }

  socket.on('userWaiting', message => {
    console.log('message', message)
  })

  socket.on('roomReady', readyMessage => {
    console.log('message', readyMessage)
    startVideoChat();
  })

  socket.on('getVideoChatOffer', (sdp: RTCSessionDescription) => {
    handleVideoChatOffer(sdp);
  })

  socket.on('getVideoChatAnswer', (sdp: RTCSessionDescription) => {
    handleVideoChatAnswer(sdp)
  })

  socket.on('getCandidate', (candidate: RTCIceCandidate) => {
    handleNewICECandidate(candidate)
  })

  function submitUsername (event: React.SyntheticEvent) {
    event.preventDefault()
    const target = event.target as typeof event.target & {
      username: { value: string };
    };
    const newUsername = target.username.value;
    socket.emit('userEnterRoom', newUsername)
    target.username.value = ''
  }

  async function createPeerConnection() {   
    myPeerConnection = new RTCPeerConnection() // For peers to connect from different networks, need to specify TURN or STUN servers

    // Set up event handlers for the ICE negotiation process.

    myPeerConnection.onicecandidate = handleICECandidateEvent;
    myPeerConnection.oniceconnectionstatechange = handleICEConnectionStateChangeEvent;
    myPeerConnection.onicegatheringstatechange = handleICEGatheringStateChangeEvent;
    myPeerConnection.onsignalingstatechange = handleSignalingStateChangeEvent;
    myPeerConnection.onnegotiationneeded = handleNegotiationNeededEvent;
    myPeerConnection.ontrack = handleTrackEvent;
  }

  async function handleNegotiationNeededEvent() {
    try {
      const offer = await myPeerConnection.createOffer({
        offerToReceiveAudio: true, 
        offerToReceiveVideo: true
      });
    
      if (myPeerConnection.signalingState !== 'stable') {
        console.log('connection is not stable yet...')
        return;
      }

      await myPeerConnection.setLocalDescription(offer)

      // send offer to remote peer
      socket.emit('videoChatOffer', {sdp: myPeerConnection.localDescription})
    } catch (err) {
      console.log('error in handleNegotiationNeededEvent: ', err)
    }
  }

  async function startVideoChat() {
    if (!myPeerConnection) {
      createPeerConnection();
    }

    // Get access to webcam stream and display it in local stream
    try {
      webcamStream = await navigator.mediaDevices.getUserMedia(mediaConstraints)
      webcamStream.getTracks().forEach((track: MediaStreamTrack) => {
        myPeerConnection.addTrack(track, webcamStream)
      })
      if (streamRef.current) {
        streamRef.current.srcObject = webcamStream;
      }
    } catch (err) {
      console.log('error in enterVideoChat - local webcam stream', err)
    }
  }

  async function handleVideoChatOffer(sdp: RTCSessionDescription) {
    // If not already connect, create RTCPeerConncetion  
    if (!myPeerConnection) {
      createPeerConnection()
    } 

    // Set up remote description to the received SDP offer
    const desc = new RTCSessionDescription(sdp)
    try {
      if (myPeerConnection.signalingState !== 'stable') {
        console.log('handle video chat offer not stable')
        await Promise.all([
          myPeerConnection.setLocalDescription({type: 'rollback'}),
          myPeerConnection.setRemoteDescription(sdp)
        ]);
        return;
      } else {
        await myPeerConnection.setRemoteDescription(desc)
      }

      // Get webcam stream
      if (!webcamStream) {
        // Get access to webcam stream and display it in local stream
        try {
          webcamStream = await navigator.mediaDevices.getUserMedia(mediaConstraints)
          if (streamRef.current) {
            streamRef.current.srcObject = webcamStream;
          }
        } catch (err) {
          console.log('error in handleVideoChatOffer - local webcam stream', err)
        }

        // Add tracks from stream to the RTCPeerConnection
        if (webcamStream) {
          try {
            webcamStream.getTracks().forEach((track: MediaStreamTrack) => {
              myPeerConnection.addTrack(track, webcamStream)
            })
          } catch (err) {
            console.log('error in handleVideoChatOffer - webcam stream add tracks', err)
          }
        }
      }

      // Send answer to caller
      try {
        const answer = await myPeerConnection.createAnswer({
          offerToReceiveVideo: true,
          offerToReceiveAudio: true,
        })
        await myPeerConnection.setLocalDescription(new RTCSessionDescription(answer))
        socket.emit('videoChatAnswer', {sdp: myPeerConnection.localDescription})
      } catch (err) {
        console.log('error in handleVideoChatOffer - sending answer', err)
      }
    } catch (err) {
      console.log('error in handleVideoChatOffer')
    }
  }

  async function handleVideoChatAnswer(sdp: RTCSessionDescription) {
    try {
      const desc = new RTCSessionDescription(sdp);
      await myPeerConnection.setRemoteDescription(desc)
    } catch (err) {
      console.log('error in handleVideoChatAnswer', err)
    }  
  }

  function handleICECandidateEvent(event: RTCPeerConnectionIceEvent) {
    if (event.candidate) {
      socket.emit('candidate', {candidate: event.candidate})
    }
  }

  async function handleNewICECandidate(candidate: RTCIceCandidate) {
    candidate = new RTCIceCandidate(candidate)
    try {
      await myPeerConnection.addIceCandidate(candidate)
    } catch (err) {
      console.log('error in handleNewICECandidate', err)
    } 
  }

  function handleICEGatheringStateChangeEvent(event: any) {
    console.log(`ice gathering state changed to: ${myPeerConnection.iceGatheringState}`)
  }

  function handleICEConnectionStateChangeEvent(event: any) {
    switch(myPeerConnection.iceConnectionState) {
      case 'closed':
      case 'failed':
      case 'disconnected':
        closeVideoCall();
        break;
    }
  }

  function handleTrackEvent(event: RTCTrackEvent) {
    if (remoteStreamRef.current) {
      remoteStreamRef.current.srcObject = event.streams[0];
    }
  }

  function closeVideoCall() {
    console.log('closing peer connection') 

    myPeerConnection.ontrack = null;
    myPeerConnection.onicecandidate = null;
    myPeerConnection.oniceconnectionstatechange = null;
    myPeerConnection.onsignalingstatechange = null;
    myPeerConnection.onicegatheringstatechange = null;
    myPeerConnection.onnegotiationneeded = null;

    myPeerConnection.getTransceivers().forEach(transceiver => {
      transceiver.stop();
    });

    myPeerConnection.close();

    if (webcamStream && streamRef.current) {
        streamRef.current.pause();
        webcamStream.getTracks().forEach(track => {
          track.stop()
        })
      }
  }

  function handleSignalingStateChangeEvent(event: any) {
    switch (myPeerConnection.signalingState) {
      case 'closed':
        closeVideoCall();
        break;
    }
  }

  function endVideoChat () {
    closeVideoCall();
  }

  return (
    <div className="container is-fluid is-flex is-flex-direction-column">
    <div>
      <h3>Instructions for testing</h3>
      <p>1. Open test room in a second browser</p>
      <p>2. Enter a username into each client</p>
      <p>3. Wait for clients to connect</p>

    </div>
    <form onSubmit={submitUsername}>
      <label>Username
        <input type="text" id="username" className="input" required/>
      </label>
      <button type="submit" className="button is-primary">Create Username</button>
    </form>
    
    <div>
      <button onClick={endVideoChat} className="button is-danger">End Video Chat</button>

      <div className="is-flex is-flex-direction-row">
        <video ref={el => { streamRef.current = el}} id="videoStream" autoPlay>There is a problem playing the video.</video>
        <video ref={el => { remoteStreamRef.current = el}} id="remoteVideoStream" autoPlay>There is a problem playing the video.</video>
      </div>
    </div>
    
  </div>
  )
}

export default Room;
