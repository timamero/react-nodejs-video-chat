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
    cy.clearLocalStorageSnapshot()
    cy.setLocalStorage('chat-username', 'sampleUser')
    cy.visit('/')
  })

  it('Header component display correct message', () => {
    cy.get('#header').contains('Welcome sampleUser')
  })

  it('NewUserForm is not displayed', () => {
    cy.get('#usernameForm').should('not.exist')
  })
})

describe('user can create a username', () => {
  beforeEach(() => {
    cy.clearLocalStorageSnapshot()
    cy.visit('/')
  })

  it('user successfully creates username', () => {
    cy.get('#usernameInput').type('sampleUser')
    cy.get('#submitUsername').click()
    cy.getLocalStorage('chat-username').should('equal', 'sampleUser')
  })

  it('if username is not unique error message is displayed', () => {
    return
  })
})
