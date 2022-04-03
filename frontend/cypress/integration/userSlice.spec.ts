import reducer, { setNewUser, setId } from '../../src/app/features/userSlice';

describe('userSlice tests', () => {
  it('initial state of user slice', () => {
    cy.visit('/')
      .window()
      .its('store')
      .invoke('getState')
      .its('user')
      .should('deep.equal', {
        socketId: '',
        username: '',
        isBusy: false
      });
  });

  it('set username', () => {
    const previousState = {
      socketId: '',
      username: '',
      isBusy: false,
    };

    expect(reducer(previousState, setNewUser('sampleUser')))
      .to.deep.equal({
        socketId: '',
        username: 'sampleUser',
        isBusy: false
      });
  });

  it('set id', () => {
    const previousState = {
      socketId: '',
      username: 'sampleUser',
      isBusy: false,
    };

    expect(reducer(previousState, setId('123abc')))
      .to.deep.equal({
        socketId: '123abc',
        username: 'sampleUser',
        isBusy: false
      });
  });
});
