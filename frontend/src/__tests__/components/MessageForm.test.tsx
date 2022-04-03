import React from 'react';
import { mount } from '@cypress/react';
import MessageForm from '../../components/Chat/MessageForm';

it('renders send button link', () => {
  mount(<MessageForm />);
  cy.get('button').contains('Send');
});