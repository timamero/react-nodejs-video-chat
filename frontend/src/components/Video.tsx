// To do: 
// Create VideoGrid component to display 1-4 users
// Emit event and stream to server
import React, { useState, useContext, useRef, useEffect } from 'react';
import { SocketContext } from '../context/socket';


/// <reference types="@types/dom-mediacapture-record" />

const Video = () => {
  const socket = useContext(SocketContext);
  const streamRef = useRef<HTMLVideoElement|null>(null);

  const [mediaStream, setMediaStream] = useState<MediaStream | undefined>(undefined);
  const [showVideo, setShowVideo] = useState<boolean>(false);
  const [refVisible, setRefVisible] = useState(false);

  useEffect(() => {
    // refVisible is used to set streamRef to value (so it is not null) on re-renders
    if (!refVisible) {
      return;
    }
  }, [refVisible])

  const toggleVideo = async () =>  {
    let stream = null;
    const constraints = {
      audio: true,
      video: { width: 400, height: 200 }
    }
    if (!showVideo) {
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        setMediaStream(stream);
        setShowVideo(!showVideo);

        // var mediaRecorder = new MediaRecorder(stream)
        // let chunks: []
        
        // mediaRecorder.onstart = e => {
        //   chunks = []
        // };

        // mediaRecorder.ondataavailable = (e: BlobEvent) => {
        //   (chunks as Blob[]).push(e.data) 
        // };

        // mediaRecorder.onstop = e => {
        //   var blob = new Blob(chunks, { 'type': 'video/mp4' })
        //   socket.emit('streamUser', blob);
        // }

      } catch(err) {
        console.log(err);
      }
    } else {
      mediaStream?.getTracks().forEach(track => track.stop())
      setMediaStream(undefined);
      setShowVideo(!showVideo);
    } 
  }
  
  const startStream = (mediaStream: MediaStream) => {
    if (streamRef.current) {
      streamRef.current.srcObject = mediaStream;
    }
  }

  if (mediaStream) {
    // https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection
    // https://stackoverflow.com/questions/50976084/how-do-i-stream-live-audio-from-the-browser-to-google-cloud-speech-via-socket-io/50976085#50976085
      startStream(mediaStream);
      socket.emit('streamUser', mediaStream);
    }

  return (
    <div>
      <button onClick={toggleVideo}>{!showVideo ? 'Show Video' : 'Hide Video'}</button>
      {showVideo && mediaStream
        &&
        <video ref={el => { streamRef.current = el; setRefVisible(!!el) }} id="videoStream" autoPlay>There is a problem playing the video.</video>
      }
    </div>
  )
}

export default Video;