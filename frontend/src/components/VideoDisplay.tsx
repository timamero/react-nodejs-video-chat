import React, { useEffect, useContext, useRef, useCallback, useMemo } from "react";
import { SocketContext } from "../context/socket";

const VideoDisplay = () => {
  const socket = useContext(SocketContext);

  const webcamStreamRef = useRef<MediaStream|null>(null)
  const myPeerConnectionRef = useRef<RTCPeerConnection|null>(null)

  const streamRef = useRef<HTMLVideoElement|null>(null);
  const remoteStreamRef = useRef<HTMLVideoElement|null>(null);

  // let myPeerConnection: RTCPeerConnection | null = null   // RTCPeerConnection
  // let myPeerConnection: RTCPeerConnection | null   // RTCPeerConnection

  const mediaConstraints = useMemo(() => {
    return {audio: true,
    video: { width: 300, height: 150 }
    }
  }, [])

  const createPeerConnection = useCallback( async () => {
    myPeerConnectionRef.current = new RTCPeerConnection() // For peers to connect from different networks, need to specify TURN or STUN servers
    
    // Set up event handlers for the ICE negotiation process.
    myPeerConnectionRef.current.onicecandidate = handleICECandidateEvent;
    myPeerConnectionRef.current.oniceconnectionstatechange = handleICEConnectionStateChangeEvent;
    myPeerConnectionRef.current.onicegatheringstatechange = handleICEGatheringStateChangeEvent;
    myPeerConnectionRef.current.onsignalingstatechange = handleSignalingStateChangeEvent;
    myPeerConnectionRef.current.onnegotiationneeded = handleNegotiationNeededEvent;
    myPeerConnectionRef.current.ontrack = handleTrackEvent;
  }, 
  [
    handleICECandidateEvent,
    handleICEConnectionStateChangeEvent,
    handleICEGatheringStateChangeEvent,
    handleSignalingStateChangeEvent,
    handleNegotiationNeededEvent,
  ])

  const startVideoChat = useCallback( async () => {
    if (!myPeerConnectionRef.current) {
      createPeerConnection();
    }

    // Get access to webcam stream and display it in local stream
    try {
      webcamStreamRef.current = await navigator.mediaDevices.getUserMedia(mediaConstraints)
      webcamStreamRef.current?.getTracks().forEach((track: MediaStreamTrack) => {
        if (myPeerConnectionRef.current) {
          myPeerConnectionRef.current.addTrack(track, webcamStreamRef.current!)
        }
      })
      if (streamRef.current) {
        streamRef.current.srcObject = webcamStreamRef.current;
      }
    } catch (err) {
      console.log('error in enterVideoChat - local webcam stream', err)
    }
  }, [createPeerConnection, mediaConstraints])

  
  useEffect(() => {
    socket.on('userWaiting', message => {
      console.log('message', message)
    })

    socket.on('roomReady', readyMessage => {
      console.log('message', readyMessage)
      startVideoChat()
    })

  }, [socket, startVideoChat, handleVideoChatOffer, handleVideoChatAnswer, handleNewICECandidate])
  

  socket.on('getVideoChatOffer', (sdp: RTCSessionDescription) => {
    handleVideoChatOffer(sdp);
  })

  socket.on('getVideoChatAnswer', (sdp: RTCSessionDescription) => {
    handleVideoChatAnswer(sdp)
  })

  socket.on('getCandidate', (candidate: RTCIceCandidate) => {
    handleNewICECandidate(candidate)
  })

  // async function createPeerConnection() {   
  //   myPeerConnection = new RTCPeerConnection() // For peers to connect from different networks, need to specify TURN or STUN servers

  //   // Set up event handlers for the ICE negotiation process.
  //   myPeerConnection.onicecandidate = handleICECandidateEvent;
  //   myPeerConnection.oniceconnectionstatechange = handleICEConnectionStateChangeEvent;
  //   myPeerConnection.onicegatheringstatechange = handleICEGatheringStateChangeEvent;
  //   myPeerConnection.onsignalingstatechange = handleSignalingStateChangeEvent;
  //   myPeerConnection.onnegotiationneeded = handleNegotiationNeededEvent;
  //   myPeerConnection.ontrack = handleTrackEvent;
  // }

  async function handleNegotiationNeededEvent() {
    if (myPeerConnection) {
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
  }

  async function handleVideoChatOffer(sdp: RTCSessionDescription) {
    // If not already connect, create RTCPeerConncetion  
    if (!myPeerConnection) {
      createPeerConnection()
    } 

    if (myPeerConnection) {
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
                if (myPeerConnection) {
                  myPeerConnection.addTrack(track, webcamStream)
                }
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
  }

  async function handleVideoChatAnswer(sdp: RTCSessionDescription) {
    if (myPeerConnection) {
      try {
        const desc = new RTCSessionDescription(sdp);
        await myPeerConnection.setRemoteDescription(desc)
      } catch (err) {
        console.log('error in handleVideoChatAnswer', err)
      } 
    }
     
  }

  function handleICECandidateEvent(event: RTCPeerConnectionIceEvent) {
    if (event.candidate) {
      socket.emit('candidate', {candidate: event.candidate})
    }
  }

  async function handleNewICECandidate(candidate: RTCIceCandidate) {
    if (myPeerConnection) {
      candidate = new RTCIceCandidate(candidate)
      try {
        await myPeerConnection.addIceCandidate(candidate)
      } catch (err) {
        console.log('error in handleNewICECandidate', err)
      } 
    } 
  }

  function handleICEGatheringStateChangeEvent(event: any) {
    if (myPeerConnection) {
      console.log(`ice gathering state changed to: ${myPeerConnection.iceGatheringState}`)
    } 
  }

  function handleICEConnectionStateChangeEvent(event: any) {
    if (myPeerConnection) {
      switch(myPeerConnection.iceConnectionState) {
        case 'closed':
        case 'failed':
        case 'disconnected':
          closeVideoCall();
          break;
      }
    }
    
  }

  function handleTrackEvent(event: RTCTrackEvent) {
    if (remoteStreamRef.current) {
      remoteStreamRef.current.srcObject = event.streams[0];
    }
  }

  function closeVideoCall() {
    console.log('closing peer connection') 

    if (myPeerConnection) {
      console.log('starting to cleear peer methods')
      myPeerConnection.ontrack = null;
      // myPeerConnection.onremovetrack = null;
      // myPeerConnection.onremovestream = null;
      myPeerConnection.onicecandidate = null;
      myPeerConnection.oniceconnectionstatechange = null;
      myPeerConnection.onsignalingstatechange = null;
      myPeerConnection.onicegatheringstatechange = null;
      myPeerConnection.onnegotiationneeded = null;

      // myPeerConnection.getTransceivers().forEach(transceiver => {
      //   transceiver.stop();
      // });

      myPeerConnection.close();
      myPeerConnection = null;
      console.log('closed peer connection')
    }
    

    if (webcamStream && streamRef.current) {
        streamRef.current.pause();
        webcamStream.getTracks().forEach(track => {
          track.stop();
        })
        streamRef.current.srcObject = null
      }

    if (remoteStreamRef.current) {
      remoteStreamRef.current.pause();
      remoteStreamRef.current.srcObject = null 
    }
  }

  function handleSignalingStateChangeEvent(event: any) {
    if (myPeerConnection) {
      switch (myPeerConnection.signalingState) {
        case 'closed':
          closeVideoCall();
          break;
      }
    }
    
  }

  // function endVideoChat () {
  //   closeVideoCall();
  //   resetUsername();
  // }

  return (
    <div className="is-flex is-flex-direction-row">
      <video ref={el => { streamRef.current = el}} id="videoStream" autoPlay>There is a problem playing the video.</video>
      <video ref={el => { remoteStreamRef.current = el}} id="remoteVideoStream" autoPlay>There is a problem playing the video.</video>
    </div>
  )
}

export default VideoDisplay;