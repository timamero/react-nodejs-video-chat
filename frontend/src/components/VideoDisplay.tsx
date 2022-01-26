import React, { useEffect, useContext, useRef, useCallback, useMemo } from "react";
import { SocketContext } from "../context/socket";
import { useAppDispatch } from '../app/hooks';
import { setVideoState } from "../app/features/roomSlice";

const VideoDisplay = () => {
  const socket = useContext(SocketContext);
  const dispatch = useAppDispatch();

  const webcamStreamRef = useRef<MediaStream|null>(null)
  const myPeerConnectionRef = useRef<RTCPeerConnection|null>(null)

  const localStreamRef = useRef<HTMLVideoElement|null>(null);
  const remoteStreamRef = useRef<HTMLVideoElement|null>(null);

  const mediaConstraints = useMemo(() => {
    return {audio: true,
    // video: { width: 300, height: 150 }
    video: { width: 250 }
    // video: true
    }
  }, [])

  const handleNegotiationNeededEvent = useCallback(async () => {
    if (myPeerConnectionRef.current) {
      try {
        const offer = await myPeerConnectionRef.current.createOffer({
          offerToReceiveAudio: true, 
          offerToReceiveVideo: true
        });
      
        if (myPeerConnectionRef.current.signalingState !== 'stable') {
          console.log('connection is not stable yet...')
          return;
        }

        await myPeerConnectionRef.current.setLocalDescription(offer)

        // send offer to remote peer
        socket.emit('video offer', {sdp: myPeerConnectionRef.current.localDescription})
      } catch (err) {
        console.log('error in handleNegotiationNeededEvent: ', err)
      }
    } 
  }, [socket])

  const handleICECandidateEvent = useCallback((event: RTCPeerConnectionIceEvent) => {
    if (event.candidate) {
      socket.emit('candidate', {candidate: event.candidate})
    }
  }, [socket])

  const handleNewICECandidate = useCallback(async (candidate: RTCIceCandidate) => {
    if (myPeerConnectionRef.current) {
      candidate = new RTCIceCandidate(candidate)
      try {
        await myPeerConnectionRef.current.addIceCandidate(candidate)
      } catch (err) {
        console.log('error in handleNewICECandidate', err)
      } 
    } 
  }, [])

  const handleICEGatheringStateChangeEvent = useCallback((event: any) => {
    if (myPeerConnectionRef.current) {
      console.log(`ice gathering state changed to: ${myPeerConnectionRef.current.iceGatheringState}`)
    } 
  }, [])

  const handleICEConnectionStateChangeEvent = useCallback((event: any) => {
    if (myPeerConnectionRef.current) {
      switch(myPeerConnectionRef.current.iceConnectionState) {
        case 'closed':
        case 'failed':
        case 'disconnected':
          closeVideoConnection();
          break;
      }
    } 
  }, [])

  const handleSignalingStateChangeEvent = useCallback((event: any) => {
    if (myPeerConnectionRef.current) {
      switch (myPeerConnectionRef.current.signalingState) {
        case 'closed':
          closeVideoConnection();
          break;
      }
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

  const handleVideoChatOffer = useCallback(async (sdp: RTCSessionDescription) => {
    // If not already connect, create RTCPeerConncetion  
    if (!myPeerConnectionRef.current) {
      createPeerConnection()
    } 

    if (myPeerConnectionRef.current) {
      // Set up remote description to the received SDP offer
      const desc = new RTCSessionDescription(sdp)
      try {
        if (myPeerConnectionRef.current.signalingState !== 'stable') {
          console.log('handle video chat offer not stable')
          await Promise.all([
            myPeerConnectionRef.current.setLocalDescription({type: 'rollback'}),
            myPeerConnectionRef.current.setRemoteDescription(sdp)
          ]);
          return;
        } else {
          await myPeerConnectionRef.current.setRemoteDescription(desc)
        }

        // Get webcam stream
        if (!webcamStreamRef.current) {
          // Get access to webcam stream and display it in local stream
          try {
            webcamStreamRef.current = await navigator.mediaDevices.getUserMedia(mediaConstraints)
            if (localStreamRef.current) {
              localStreamRef.current.srcObject = webcamStreamRef.current;
            }
          } catch (err) {
            console.log('error in handleVideoChatOffer - local webcam stream', err)
          }

          // Add tracks from stream to the RTCPeerConnection
          if (webcamStreamRef.current) {
            try {
              webcamStreamRef.current.getTracks().forEach((track: MediaStreamTrack) => {
                if (myPeerConnectionRef.current) {
                  myPeerConnectionRef.current.addTrack(track, webcamStreamRef.current!)
                }
              })
            } catch (err) {
              console.log('error in handleVideoChatOffer - webcam stream add tracks', err)
            }
          }
        }

        // Send answer to caller
        try {
          const answer = await myPeerConnectionRef.current.createAnswer({
            offerToReceiveVideo: true,
            offerToReceiveAudio: true,
          })
          await myPeerConnectionRef.current.setLocalDescription(new RTCSessionDescription(answer))
          socket.emit('video answer', {sdp: myPeerConnectionRef.current.localDescription})
        } catch (err) {
          console.log('error in handleVideoChatOffer - sending answer', err)
        }
      } catch (err) {
        console.log('error in handleVideoChatOffer')
      }
    } 
  }, [createPeerConnection, socket, mediaConstraints])

  const handleVideoChatAnswer = useCallback(async (sdp: RTCSessionDescription) => {
    if (myPeerConnectionRef.current) {
      try {
        const desc = new RTCSessionDescription(sdp);
        await myPeerConnectionRef.current.setRemoteDescription(desc)
      } catch (err) {
        console.log('error in handleVideoChatAnswer', err)
      } 
    }
  }, [])

  const startVideoChat = useCallback( async () => {
    if (!myPeerConnectionRef.current) {
      createPeerConnection();
    }

    // Get access to webcam stream and display it in local stream
    try {
      webcamStreamRef.current = await navigator.mediaDevices.getUserMedia(mediaConstraints)
      webcamStreamRef.current.getTracks().forEach((track: MediaStreamTrack) => {
        if (myPeerConnectionRef.current) {
          myPeerConnectionRef.current.addTrack(track, webcamStreamRef.current!)
        }
      })
      if (localStreamRef.current) {
        localStreamRef.current.srcObject = webcamStreamRef.current;
      }
    } catch (err) {
      console.log('error in enterVideoChat - local webcam stream', err)
    }
  }, [createPeerConnection, mediaConstraints])

  
  useEffect(() => {
    socket.on('video ready', () => {
      startVideoChat()
    })

    socket.on('get video offer', (sdp: RTCSessionDescription) => {
      handleVideoChatOffer(sdp);
      dispatch(setVideoState(true))
    })

    socket.on('get video answer', (sdp: RTCSessionDescription) => {
      handleVideoChatAnswer(sdp)
    })
  
    socket.on('get candidate', (candidate: RTCIceCandidate) => {
      handleNewICECandidate(candidate)
    })

    socket.on('end video request', () => {
      console.log('received end video request')
      closeVideoConnection()
      dispatch(setVideoState(false))
    })

  }, [socket, dispatch, startVideoChat, handleVideoChatOffer, handleVideoChatAnswer, handleNewICECandidate])

  function handleTrackEvent(event: RTCTrackEvent) {
    if (remoteStreamRef.current) {
      remoteStreamRef.current.srcObject = event.streams[0];
    }
  }

  function closeVideoConnection() {
    console.log('closing peer connection') 

    if (myPeerConnectionRef.current) {
      console.log('starting to clear peer methods')
      myPeerConnectionRef.current.ontrack = null;
      myPeerConnectionRef.current.onicecandidate = null;
      myPeerConnectionRef.current.oniceconnectionstatechange = null;
      myPeerConnectionRef.current.onsignalingstatechange = null;
      myPeerConnectionRef.current.onicegatheringstatechange = null;
      myPeerConnectionRef.current.onnegotiationneeded = null;

      myPeerConnectionRef.current.close();
      myPeerConnectionRef.current = null;
      console.log('closed peer connection')
    }
    
    if (webcamStreamRef.current && localStreamRef.current) {
        localStreamRef.current.pause();
        webcamStreamRef.current.getTracks().forEach(track => {
          track.stop();
        })
        webcamStreamRef.current = null
        localStreamRef.current.srcObject = null
      }

    if (remoteStreamRef.current) {
      remoteStreamRef.current.pause();
      remoteStreamRef.current.srcObject = null 
    }
  }

  return (
    <div className="is-flex is-flex-direction-row is-justify-content-space-evenly">
      <div className="m-1">
        <video ref={el => { localStreamRef.current = el}} id="videoStream" autoPlay>There is a problem playing the video.</video>
      </div>
      <div className="m-1">
        <video ref={el => { remoteStreamRef.current = el}} id="remoteVideoStream" autoPlay>There is a problem playing the video.</video>
      </div>
    </div>
  )
}

export default VideoDisplay;