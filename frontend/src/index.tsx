import React from 'react';
import ReactDOM from 'react-dom';
import { SocketContext, socket } from './context/socket';
import './index.css';
import App from './App';

ReactDOM.render(
  <SocketContext.Provider value={socket}>
    <App />
  </SocketContext.Provider>
  , document.getElementById('root')
);

