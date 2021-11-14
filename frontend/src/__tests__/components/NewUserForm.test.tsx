import React from "react";
import { mount } from '@cypress/react';
import NewUserForm from "../../components/NewUserForm";

describe('NewUserForm tests', () => {
  beforeEach(() => {
    cy.clearLocalStorageSnapshot()
  })

  it('NewUserForm is rendered', () => {
    mount(<NewUserForm />);
    cy.get('#usernameForm').contains('Username');
    cy.get('#submitUsername').contains('Submit')
  });

  it('user can submit username', () => {
    mount(<NewUserForm />);
    cy.get('#usernameInput').type('sampleChatUser')
    cy.get('#usernameForm').submit()
  })

  it('after user submits username it is saved to localStorage', () => {
    mount(<NewUserForm />);
    cy.get('#usernameInput').type('sampleChatUser')
    cy.get('#usernameForm').submit()

    cy.getLocalStorage('chat-username')
      .then(usernameInStorage => {
        assert.equal(usernameInStorage, 'sampleChatUser')
      })
  })
})


