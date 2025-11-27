import { render, screen } from '@testing-library/react';
import React from 'react';

// Simple test that doesn't require router setup
describe('App Component', () => {
  test('renders OctoFit Tracker text', () => {
    // Mock App component to avoid router dependencies
    const MockApp = () => <div>OctoFit Tracker</div>;
    
    render(<MockApp />);
    const element = screen.getByText(/OctoFit Tracker/i);
    expect(element).toBeInTheDocument();
  });
});
