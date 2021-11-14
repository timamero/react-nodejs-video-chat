import { mount } from '@cypress/react';
import ActiveUsers from '../../components/ActiveUsers';

describe('ActiveUsers tests', () => {
  beforeEach(() => {
    cy.clearLocalStorageSnapshot();
    mount(<ActiveUsers />);
  })

  it('ActiveUsers is rendered', () => {
    cy.get('#activeUsersList').contains('Active Users');
  });
})