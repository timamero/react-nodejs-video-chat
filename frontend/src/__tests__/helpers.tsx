import React from "react";
import { Provider } from "react-redux";
import { Store } from 'redux';

interface ReduxProviderProps {
  children: JSX.Element;
  store: Store;
}

export const ReduxProvider: React.FC<ReduxProviderProps> = ({ children, store }) => {   
  return (
    <Provider store={store}>
      {children}
    </Provider>
)}

