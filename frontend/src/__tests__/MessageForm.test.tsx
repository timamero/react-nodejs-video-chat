import React from 'react';
import { mount } from '@cypress/react';
import MessageForm from '../components/MessageForm';

it('renders learn react link', () => {
  mount(<MessageForm />);
  cy.get('button').contains('Send');
});