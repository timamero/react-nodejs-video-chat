import React from 'react';
import ActiveUsers from '../components/ActiveUsers';
import Layout from '../components/Layout';
import NewUserForm from '../components/NewUserForm/NewUserForm';
import { useAppSelector } from '../app/hooks';
// import { SocketContext } from '../context/socket';
import { sendEndChat } from '../services/socket/publishers';

const Home: React.FC = () => {
  // const socket = useContext(SocketContext);
  const username = useAppSelector(state => state.user.username);
  const isUserBusy = useAppSelector(state => state.user.isBusy);
  const roomId = useAppSelector(state => state.room.roomId);

  // If user returns to home page without ending the chat using the `End Chat`
  // button, send event to close the chat to server
  if (isUserBusy) {
    sendEndChat(roomId);
  }

  return (
    <Layout>
      {username
        ? <p id="welcome" className="is-size-5 has-text-centered">Welcome {username}</p>
        : <p className="is-size-5 has-text-centered">Create a username to chat.</p>
      }
      {!username
        ?
        <NewUserForm />
        :
        <ActiveUsers />
      }
    </Layout>
  );
};

export default Home;