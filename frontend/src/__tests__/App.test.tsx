import { mount } from '@cypress/react';
import App from '../App';

describe('App tests', () => {
  beforeEach(() => {
    cy.clearLocalStorageSnapshot();
    mount(<App />);
  })

  it('if there is a username in localStorage it\'s value gets saved to the user.username state variable', () => {
    return;
  })

})