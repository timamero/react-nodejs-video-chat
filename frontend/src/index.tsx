import React from 'react';
import ReactDOM from 'react-dom';
import { SocketContext, socket } from './context/socket';
import './index.css';
import App from './App';
import { store } from './app/store';
import { Provider } from 'react-redux'

ReactDOM.render(
  <Provider store={store}>
    <SocketContext.Provider value={socket}>
      <App />
    </SocketContext.Provider>
  </Provider>, 
  document.getElementById('root')
);

