describe('home page with no username stored in localStorage', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.clearLocalStorageSnapshot()
  })

  it('home page can be opened and is rendered', () => {
    cy.get('#navbar').contains('Home')
    cy.get('#activeUsersList').contains('Active Users')
  })

  it('Header component display correct message', () => {
    cy.get('#header').contains('Create a username to chat')
  })

  it('NewUserForm is displayed', () => {
    cy.get('#usernameForm').should('exist')
  })
})

describe('home page with username stored in localStorage', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.clearLocalStorageSnapshot()
    cy.setLocalStorage('chat-username', 'sampleUser')
  })

  it('Header component display correct message', () => {
    cy.get('#header').contains('Welcome sampleUser')
  })

  it('NewUserForm is not displayed', () => {
    cy.get('#usernameForm').should('not.exist')
  })
})

describe('user can create a username', () => {
  it('user successfully creates username', () => {
    return
  })

  it('if username is not unique error message is displayed', () => {
    return
  })
})
