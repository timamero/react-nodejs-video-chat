/**
 * Local and remote video stream display
 * RTC Peer connection handling
 */
import React, { useEffect, useContext, useRef, useCallback, useMemo } from "react";
import { SocketContext } from "../../../context/socket";
import { useAppDispatch, useAppSelector } from '../../../app/hooks';

const VideoDisplay = () => {
  const roomId = useAppSelector(state => state.room.roomId);
  const socket = useContext(SocketContext);
  const dispatch = useAppDispatch();

  const webcamStreamRef = useRef<MediaStream|null>(null);
  const myPeerConnectionRef = useRef<RTCPeerConnection|null>(null);

  const localStreamRef = useRef<HTMLVideoElement|null>(null);
  const remoteStreamRef = useRef<HTMLVideoElement|null>(null);

  const mediaConstraints = useMemo(() => {
    return {
      audio: true,
      video: { width: 250 }
    };
  }, []);

  /**
   * Event handler for the negotiationneeded event
   * Documentation: https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/negotiationneeded_event
   */
  const handleNegotiationNeededEvent = useCallback(async () => {
    if (myPeerConnectionRef.current) {
      try {
        const offer = await myPeerConnectionRef.current.createOffer({
          offerToReceiveAudio: true, 
          offerToReceiveVideo: true
        });
      
        if (myPeerConnectionRef.current.signalingState !== 'stable') {
          console.log('connection is not stable yet...');
          return;
        };

        await myPeerConnectionRef.current.setLocalDescription(offer);

        // Send offer to remote peer
        socket.emit('video offer', {sdp: myPeerConnectionRef.current.localDescription, roomId});
      } catch (err) {
        console.error('error in negotiationneeded event: ', err);
      };
    };
  }, [socket, roomId]);

  /**
   * Event handler for icecandidateevent
   * Documentation: https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/icecandidate_event
   */
  const handleICECandidateEvent = useCallback((event: RTCPeerConnectionIceEvent) => {
    if (event.candidate) {
      socket.emit('candidate', {candidate: event.candidate, roomId});
    };
  }, [socket, roomId]);

  /**
   * Handle event for receiving ice candidate
   * Documentation: https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/addIceCandidate
   */
  const handleNewICECandidate = useCallback(async (candidate: RTCIceCandidate) => {
    if (myPeerConnectionRef.current) {
      candidate = new RTCIceCandidate(candidate);
      try {
        await myPeerConnectionRef.current.addIceCandidate(candidate);
      } catch (err) {
        console.error('error in adding ice candidate ', err);
      } ;
    };
  }, []);

  /**
   * Event handler for icegatheringstatechange event
   * Documentation: https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/icegatheringstatechange_event
   */
  const handleICEGatheringStateChangeEvent = useCallback((event: any) => {
    if (myPeerConnectionRef.current) {
      console.log(`ice gathering state changed to: ${myPeerConnectionRef.current.iceGatheringState}`);
    };
  }, []);

  /**
   * Event handler for iceconnectionstatechange event
   * Documentation: https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/iceconnectionstatechange_event
   */
  const handleICEConnectionStateChangeEvent = useCallback((event: any) => {
    if (myPeerConnectionRef.current) {
      switch(myPeerConnectionRef.current.iceConnectionState) {
        case 'closed':
        case 'failed':
        case 'disconnected':
          closeVideoConnection();
          break;
      };
    };
  }, []);

  /**
   * Event handler for signalingstatechange event
   * Documentation: https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/signalingstatechange_event
   */
  const handleSignalingStateChangeEvent = useCallback((event: any) => {
    if (myPeerConnectionRef.current) {
      switch (myPeerConnectionRef.current.signalingState) {
        case 'closed':
          closeVideoConnection();
          break;
      };
    };
  }, []);

  /**
   * Create RTCPeerConnection
   * Documentation: https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/RTCPeerConnection
   */
  const createPeerConnection = useCallback( async () => {
    myPeerConnectionRef.current = new RTCPeerConnection(); // For peers to connect from different networks, need to specify TURN or STUN servers
    
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
  ]);

  /**
   * When handleVideoChatOffer is called, the remote and local descriptions are set
   * and the local web stream is added to the RTCPeerConnection
   * Documentation - 
   * RTCSessionDescription: https://developer.mozilla.org/en-US/docs/Web/API/RTCSessionDescription
   * signalingState: https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/signalingState
   * setLocalDescription: https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/setLocalDescription
   * setRemoteDescription: https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/setRemoteDescription
   * createAnswer: https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createAnswer
   * mediaDevices.getUserMedia: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
   */
  const handleVideoChatOffer = useCallback(async (sdp: RTCSessionDescription) => {
    // If not already connected, create RTCPeerConncetion  
    if (!myPeerConnectionRef.current) {
      createPeerConnection();
    };

    if (myPeerConnectionRef.current) {
      // Set up remote description to the received SDP offer
      const desc = new RTCSessionDescription(sdp);
      try {
        if (myPeerConnectionRef.current.signalingState !== 'stable') {
          console.log('handle video chat offer not stable')
          await Promise.all([
            myPeerConnectionRef.current.setLocalDescription({type: 'rollback'}),
            myPeerConnectionRef.current.setRemoteDescription(sdp)
          ]);
          return;
        } else {
          await myPeerConnectionRef.current.setRemoteDescription(desc);
        };

        if (!webcamStreamRef.current) {
          // Get access to local webcam stream
          try {
            webcamStreamRef.current = await navigator.mediaDevices.getUserMedia(mediaConstraints);
            if (localStreamRef.current) {
              localStreamRef.current.srcObject = webcamStreamRef.current;
            };
          } catch (err) {
            console.error('error in handleVideoChatOffer - local webcam stream', err);
          };
          
          // Add tracks from local stream to the RTCPeerConnection
          if (webcamStreamRef.current) {
            try {
              // webcamStreamRef.current = await navigator.mediaDevices.getUserMedia(mediaConstraints);
              webcamStreamRef.current.getTracks().forEach((track: MediaStreamTrack) => {
                if (myPeerConnectionRef.current) {
                  myPeerConnectionRef.current.addTrack(track, webcamStreamRef.current!);
                };
              });
            } catch (err) {
              console.error('error in handleVideoChatOffer - webcam stream add tracks', err);
            };
          };
        };

        // Send answer to caller
        try {
          const answer = await myPeerConnectionRef.current.createAnswer({
            offerToReceiveVideo: true,
            offerToReceiveAudio: true,
          });
          await myPeerConnectionRef.current.setLocalDescription(new RTCSessionDescription(answer));
          socket.emit('video answer', {sdp: myPeerConnectionRef.current.localDescription, roomId});
        } catch (err) {
          console.error('error in handleVideoChatOffer - sending answer', err);
        };
      } catch (err) {
        console.error('error in handleVideoChatOffer');
      };
    };
  }, [createPeerConnection, socket, mediaConstraints, roomId]);

  /**
   * When handleVideoChatAnswer is called, the sets the specified session description as the remote peer's current answer.
   * Documentation - 
   * RTCSessionDescription: https://developer.mozilla.org/en-US/docs/Web/API/RTCSessionDescription
   * setRemoteDescription: https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/setRemoteDescription
   */
  const handleVideoChatAnswer = useCallback(async (sdp: RTCSessionDescription) => {
    if (myPeerConnectionRef.current) {
      try {
        const desc = new RTCSessionDescription(sdp);
        await myPeerConnectionRef.current.setRemoteDescription(desc);
      } catch (err) {
        console.error('error in handleVideoChatAnswer', err);
      };
    };
  }, []);

  const startVideoChat = useCallback( async () => {
    if (!myPeerConnectionRef.current) {
      createPeerConnection();
    };

    // Get access to webcam stream and display it in local stream
    try {
      webcamStreamRef.current = await navigator.mediaDevices.getUserMedia(mediaConstraints)
      webcamStreamRef.current.getTracks().forEach((track: MediaStreamTrack) => {
        if (myPeerConnectionRef.current) {
          myPeerConnectionRef.current.addTrack(track, webcamStreamRef.current!);
        };
      });
      if (localStreamRef.current) {
        localStreamRef.current.srcObject = webcamStreamRef.current;
      };
    } catch (err) {
      console.log('error in startVideoChat', err);
    };
  }, [createPeerConnection, mediaConstraints]);

  
  useEffect(() => {
    socket.on('video ready', () => {
      startVideoChat();
    });

    socket.on('get video offer', (sdp: RTCSessionDescription) => {
      handleVideoChatOffer(sdp);
    });

    socket.on('get video answer', (sdp: RTCSessionDescription) => {
      handleVideoChatAnswer(sdp);
    });
  
    socket.on('get candidate', (candidate: RTCIceCandidate) => {
      handleNewICECandidate(candidate);
    });

    socket.on('end video request', () => {
      closeVideoConnection();
    });

    return () => {
      socket.off('video ready');
      socket.off('get video offer');
      socket.off('get video answer');
      socket.off('get candidate');
      socket.off('end video request');
    };

  }, [socket, dispatch, startVideoChat, handleVideoChatOffer, handleVideoChatAnswer, handleNewICECandidate]);

  /**
   * Get remote stream so that it can be displayed
   */
  function handleTrackEvent(event: RTCTrackEvent) {
    remoteStreamRef.current!.srcObject = event.streams[0];
  };

  function closeVideoConnection() {
    if (myPeerConnectionRef.current) {
      myPeerConnectionRef.current.ontrack = null;
      myPeerConnectionRef.current.onicecandidate = null;
      myPeerConnectionRef.current.oniceconnectionstatechange = null;
      myPeerConnectionRef.current.onsignalingstatechange = null;
      myPeerConnectionRef.current.onicegatheringstatechange = null;
      myPeerConnectionRef.current.onnegotiationneeded = null;

      myPeerConnectionRef.current.close();
      myPeerConnectionRef.current = null;
      console.log('closed peer connection');
    };
    
    if (webcamStreamRef.current && localStreamRef.current) {
      localStreamRef.current.pause();
      webcamStreamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      webcamStreamRef.current = null;
      localStreamRef.current.srcObject = null;
    };

    if (remoteStreamRef.current) {
      remoteStreamRef.current.pause();
      remoteStreamRef.current.srcObject = null;
    };
  };

  return (
    <div className="is-flex is-flex-direction-column is-justify-content-space-evenly is-align-items-center">
      <div className="videoWrapper local m-1">
        <video ref={el => { localStreamRef.current = el}} id="videoStream" autoPlay>There is a problem playing the video.</video>
      </div>
      <div className="videoWrapper remote m-1">
        <video ref={el => { remoteStreamRef.current = el}} id="remoteVideoStream" autoPlay>There is a problem playing the video.</video>
      </div>
    </div>
  )
};

export default VideoDisplay;