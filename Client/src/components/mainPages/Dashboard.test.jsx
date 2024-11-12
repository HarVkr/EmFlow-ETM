import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';
import GlobalState from '../../GlobalState';

test('renders Dashboard component', () => {
  const state = {
    role: ['Team Manager'],
  };

  render(
    <GlobalState.Provider value={state}>
      <Dashboard />
    </GlobalState.Provider>
  );

  expect(screen.getByText('Dashboard')).toBeInTheDocument();
});