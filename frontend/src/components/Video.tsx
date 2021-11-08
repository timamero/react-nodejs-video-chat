import React, { useState, useContext, useRef, useEffect } from 'react';
import { SocketContext } from '../context/socket';

const Video = () => {
  const socket = useContext(SocketContext);
  const streamRef = useRef<HTMLVideoElement|null>(null);

  const [mediaStream, setMediaStream] = useState<MediaStream | undefined>(undefined)
  const [showVideo, setShowVideo] = useState<boolean>(false)
  const [refVisible, setRefVisible] = useState(false)

  useEffect(() => {
    // refVisible is used to set streamRef to value (so it is not null) on re-renders
    if (!refVisible) {
      return
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
        setMediaStream(stream)
        setShowVideo(!showVideo)
      } catch(err) {
        console.log(err)
      }
    } else {
      mediaStream?.getTracks().forEach(track => track.stop())
      setMediaStream(undefined)
      setShowVideo(!showVideo)
    } 
  }
  
  const startStream = (mediaStream: MediaStream) => {
    if (streamRef.current) {
      streamRef.current.srcObject = mediaStream
    }
  }

  if (mediaStream) {
      startStream(mediaStream)
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