import React from "react";
import { mount } from '@cypress/react';
import NewUserForm from "../../components/NewUserForm";
import { store } from '../../app/store';
import { ReduxProvider } from '../helpers';

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


