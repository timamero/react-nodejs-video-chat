/*
Test Room component - for reference

https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling

To do:
- Close peer connection correctly
*/
 
import React, { useContext } from 'react'
import TestUsernameForm from '../components/testComponents/testUsernameForm';
import TestVideoGrid from '../components/testComponents/testVideoGrid';
import { SocketContext } from '../context/socket';

const TestRoom: React.FC = () => {
  const socket = useContext(SocketContext);

  function submitUsername (event: React.SyntheticEvent) {
    event.preventDefault()
    const target = event.target as typeof event.target & {
      username: { value: string };
    };
    const newUsername = target.username.value;
    socket.emit('userEnterRoom', newUsername)
    target.username.value = ''
  }

  return (
    <div className="container is-fluid is-flex is-flex-direction-column">
    <div>
      <h3>Instructions for testing</h3>
      <p>1. Open test room in a second browser</p>
      <p>2. Enter a username into each client</p>
      <p>3. Wait for clients to connect</p>
    </div>
    <TestUsernameForm submitUsername={submitUsername} />
    <TestVideoGrid />
  </div>
  )
}

export default TestRoom;
