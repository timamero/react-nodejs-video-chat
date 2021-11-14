it('home page can be opened and is rendered', () => {
  cy.visit('/')
  cy.get('#navbar').contains('Home')
  cy.get('#activeUsersList').contains('Active Users')
})