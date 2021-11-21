/* eslint-disable jest/valid-expect */
import reducer, { getAllActiveUsers } from '../../src/app/features/activeUsersSlice'

describe('activeUserSlice tests', () => {
  it('initial state of active user slice', () => {
    cy.visit('/')
      .window()
      .its('store')
      .invoke('getState')
      .its('activeUsers')
      .should('deep.equal', {
        users: []
      })
  })

  it.only('get all active users', () => {
    const previousState = { users: []}

    const userArr = [
      {
        id: '1',
        username: 'user1',
      },
      {
        id: '2',
        username: 'user2',
      },
      {
        id: '3',
        username: 'user3',
      }
    ]
    expect(reducer(previousState, getAllActiveUsers(userArr)))
      .to.deep.equal({
        users: [
          {
            id: '1',
            username: 'user1',
          },
          {
            id: '2',
            username: 'user2',
          },
          {
            id: '3',
            username: 'user3',
          }
        ]
      })
  })
})