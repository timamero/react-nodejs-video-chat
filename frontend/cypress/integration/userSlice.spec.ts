import reducer, { setNewUser, setId } from '../../src/app/features/userSlice'

describe('userSlice tests', () => {
  it('initial state of user slice', () => {
    cy.visit('/')
      .window()
      .its('store')
      .invoke('getState')
      .its('user')
      .should('deep.equal', {
        id: '',
        username: '',
      })
  })

  it('set username', () => {
    const previousState = {
      id: '',
      username: ''
    }

    expect(reducer(previousState, setNewUser('sampleUser')))
      .to.deep.equal({ 
        id: '',
        username: 'sampleUser'
      })
  })

  it.only('set id', () => {
    const previousState = {
      id: '',
      username: 'sampleUser'
    }

    expect(reducer(previousState, setId('123abc')))
      .to.deep.equal({ 
        id: '123abc',
        username: 'sampleUser'
      })
  })
})
