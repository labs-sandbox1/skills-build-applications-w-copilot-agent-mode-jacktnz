import { render, screen, waitFor } from '@testing-library/react';
import Activities from './Activities';

global.fetch = jest.fn();

describe('Activities Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders activities heading after loading', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => []
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => []
      });
    
    render(<Activities />);
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Activities/i })).toBeInTheDocument();
    });
  });

  test('displays activities with user names', async () => {
    const mockActivities = [
      { id: 1, type: 'Running', duration: 30, user: 1, timestamp: '2025-11-27T10:00:00Z' }
    ];
    const mockUsers = [
      { id: 1, name: 'Iron Man' }
    ];

    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockActivities
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockUsers
      });

    render(<Activities />);

    await waitFor(() => {
      expect(screen.getByText('Running')).toBeInTheDocument();
    });
    expect(screen.getByText('Iron Man')).toBeInTheDocument();
    expect(screen.getByText(/30/)).toBeInTheDocument();
  });
});
