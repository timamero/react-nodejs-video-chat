import React, {useState, useContext} from "react";
import { SocketContext } from "../context/socket";

const VideoDisplay: React.FC = () => {
  const socket = useContext(SocketContext)
  const [mediaStream, setMediaStream] = useState<MediaStream | undefined>(undefined);

  // useEffect(() => {
    
  // }, [socket, mediaStream])
  socket.on('streamUser', function(stream: MediaStream) {
        console.log('useEffect getting stresm', stream)
        setMediaStream(stream)
      })

  console.log('video display', mediaStream)

  return (
    <div>
      <h2>Video display</h2>
      
    </div>
  )
}

export default VideoDisplay