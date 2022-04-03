import reducer, { getAllActiveUsers } from '../../src/app/features/activeUsersSlice';

describe('activeUserSlice tests', () => {
  it('initial state of active user slice', () => {
    cy.visit('/')
      .window()
      .its('store')
      .invoke('getState')
      .its('activeUsers')
      .should('deep.equal', {
        users: []
      });
  });

  it('get all active users', () => {
    const previousState = { users: [] };

    const userArr = [
      {
        socketId: '1',
        username: 'user1',
        isBusy: false
      },
      {
        socketId: '2',
        username: 'user2',
        isBusy: false
      },
      {
        socketId: '3',
        username: 'user3',
        isBusy: false
      }
    ];
    expect(reducer(previousState, getAllActiveUsers(userArr)))
      .to.deep.equal({
        users: [
          {
            socketId: '1',
            username: 'user1',
            isBusy: false
          },
          {
            socketId: '2',
            username: 'user2',
            isBusy: false
          },
          {
            socketId: '3',
            username: 'user3',
            isBusy: false
          }
        ]
      });
  });
});