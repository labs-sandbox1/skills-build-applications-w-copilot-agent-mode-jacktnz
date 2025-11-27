import { render, screen, waitFor } from '@testing-library/react';
import Leaderboard from './Leaderboard';

global.fetch = jest.fn();

describe('Leaderboard Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders leaderboard heading after loading', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => []
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => []
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => []
      });
    
    render(<Leaderboard />);
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Leaderboard/i })).toBeInTheDocument();
    });
  });

  test('displays leaderboard with rankings', async () => {
    const mockLeaderboard = [
      { id: 1, team: 1, points: 150 },
      { id: 2, team: 2, points: 120 }
    ];
    const mockTeams = [
      { id: 1, name: 'Marvel' },
      { id: 2, name: 'DC' }
    ];
    const mockUsers = [
      { id: 1, name: 'Iron Man', team: 1 },
      { id: 2, name: 'Batman', team: 2 }
    ];

    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockLeaderboard
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockTeams
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockUsers
      });

    render(<Leaderboard />);

    await waitFor(() => {
      expect(screen.getByText('Marvel')).toBeInTheDocument();
    });
    expect(screen.getByText('DC')).toBeInTheDocument();
    expect(screen.getByText(/150 pts/)).toBeInTheDocument();
    expect(screen.getByText(/120 pts/)).toBeInTheDocument();
  });
});
