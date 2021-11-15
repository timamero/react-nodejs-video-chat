import React from "react";
import { mount } from '@cypress/react';
import { Provider } from "react-redux";
import NewUserForm from "../../components/NewUserForm";
import { Store } from "redux";
import { store } from '../../app/store';

interface ReduxProviderProps {
  children: JSX.Element;
  store: Store;
}

const ReduxProvider: React.FC<ReduxProviderProps> = ({ children, store }) => {   
  return (
    <Provider store={store}>
      {children}
    </Provider>
)}

describe('NewUserForm tests', () => {
  beforeEach(() => {
    cy.clearLocalStorageSnapshot()
    mount(
      <ReduxProvider store={store}>
        <NewUserForm />
      </ReduxProvider>
    )
  })

  it('NewUserForm is rendered', () => {
    cy.get('#usernameForm').contains('Username');
    cy.get('#submitUsername').contains('Submit')
  });

  it('user can submit username', () => {
    cy.get('#usernameInput').type('sampleChatUser')
    cy.get('#usernameForm').submit()
  })

  it('after user submits username it is saved to localStorage', () => {
    cy.get('#usernameInput').type('sampleChatUser')
    cy.get('#usernameForm').submit()

    cy.getLocalStorage('chat-username')
      .then(usernameInStorage => {
        assert.equal(usernameInStorage, 'sampleChatUser')
      })
  })
})


