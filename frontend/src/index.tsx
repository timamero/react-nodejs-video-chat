import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { SocketContext, socket } from './context/socket';
import App from './App';
import { store } from './app/store';

ReactDOM.render(
  <Provider store={store}>
    <SocketContext.Provider value={socket}>
      <App />
    </SocketContext.Provider>
  </Provider>, 
  document.getElementById('root')
);

// @ts-ignore
if (window.Cypress) { 
  // @ts-ignore
  window.store = store
}