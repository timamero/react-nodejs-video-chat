import React from 'react';
import { mount } from '@cypress/react';
import MessageForm from '../components/MessageForm';

it('renders send button lenk', () => {
  mount(<MessageForm />);
  cy.get('button').contains('Send');
});