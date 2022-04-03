import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { SocketContext, socket } from './context/socket';
import App from './App';
import { store } from './app/store';

ReactDOM.render(
  <Provider store={store}>
    <SocketContext.Provider value={socket}>
      <Router>
        <App />
      </Router>
    </SocketContext.Provider>
  </Provider>,
  document.getElementById('root')
);

// @ts-ignore
if (window.Cypress) {
  // @ts-ignore
  window.store = store;
}