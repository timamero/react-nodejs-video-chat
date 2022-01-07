import React from "react";

const VideoDisplay = () => {

  return (
    <div className="is-flex is-flex-direction-row">
      <video id="videoStream" autoPlay>There is a problem playing the video.</video>
      <video id="remoteVideoStream" autoPlay>There is a problem playing the video.</video>
    </div>
  )
}

export default VideoDisplay;