import { render, screen } from '@testing-library/react';
import React from 'react';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }) => <div>{children}</div>,
  Routes: ({ children }) => <div>{children}</div>,
  Route: () => null,
  Link: ({ children, to }) => <a href={to}>{children}</a>
}));

describe('App Component', () => {
  test('renders OctoFit Tracker navigation', () => {
    const App = require('./App').default;
    render(<App />);
    const navElement = screen.getByText(/OctoFit Tracker/i);
    expect(navElement).toBeInTheDocument();
  });
});
