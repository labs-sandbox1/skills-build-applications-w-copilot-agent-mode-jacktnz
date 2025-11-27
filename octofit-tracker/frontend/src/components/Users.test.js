import { render, screen, waitFor } from '@testing-library/react';
import Users from './Users';

// Mock fetch
global.fetch = jest.fn();

describe('Users Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders users heading after loading', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => []
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => []
      });
    
    render(<Users />);
    
    await waitFor(() => {
      expect(screen.getByText(/Users/i)).toBeInTheDocument();
    });
  });

  test('displays users when data is fetched', async () => {
    const mockUsers = [
      { id: 1, name: 'Iron Man', email: 'ironman@marvel.com', team: 1 }
    ];
    const mockTeams = [
      { id: 1, name: 'Marvel' }
    ];

    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockUsers
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockTeams
      });

    render(<Users />);

    await waitFor(() => {
      expect(screen.getByText('Iron Man')).toBeInTheDocument();
    });
    expect(screen.getByText('ironman@marvel.com')).toBeInTheDocument();
    expect(screen.getByText('Marvel')).toBeInTheDocument();
  });

  test('displays error message on fetch failure', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    render(<Users />);

    await waitFor(() => {
      expect(screen.getByText(/Error:/i)).toBeInTheDocument();
    });
  });
});
