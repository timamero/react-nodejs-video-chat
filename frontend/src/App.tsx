import React, { useContext } from 'react';
import { SocketContext } from './context/socket';
import Chat from './components/Chat';
import Video from './components/Video';

const App: React.FC = () => {
  const socket = useContext(SocketContext)

  if (socket) {
    socket.connect()

    socket.on('connect', () => {
      console.log('react connected')
    }) 
  }

  return (
    <div className="App container is-fluid is-flex is-flex-direction-row">
      <Video />
      {/* <Chat /> */}
    </div>
  );
}

export default App;
