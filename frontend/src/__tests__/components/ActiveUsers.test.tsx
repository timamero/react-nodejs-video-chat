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

  it('if there are no active users list is empty', () => {
    return
  })

  describe('active users list has more than one user', () => {
    it('list of active users is not shown if user does not have username', () => {
      return
    })

    it('list of active users is shown if user has username', () => {
      return
    })
  })

  
})