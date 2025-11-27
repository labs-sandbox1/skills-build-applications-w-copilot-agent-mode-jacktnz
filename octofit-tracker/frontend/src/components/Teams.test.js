import { render, screen, waitFor } from '@testing-library/react';
import Teams from './Teams';

global.fetch = jest.fn();

describe('Teams Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders teams heading after loading', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => []
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => []
      });
    
    render(<Teams />);
    
    await waitFor(() => {
      expect(screen.getByText(/Teams/i)).toBeInTheDocument();
    });
  });

  test('displays teams with members', async () => {
    const mockTeams = [
      { id: 1, name: 'Marvel', description: 'Marvel Superheroes' }
    ];
    const mockUsers = [
      { id: 1, name: 'Iron Man', team: 1 },
      { id: 2, name: 'Captain America', team: 1 }
    ];

    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockTeams
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockUsers
      });

    render(<Teams />);

    await waitFor(() => {
      expect(screen.getByText('Marvel')).toBeInTheDocument();
    });
    expect(screen.getByText('Marvel Superheroes')).toBeInTheDocument();
    expect(screen.getByText('Iron Man')).toBeInTheDocument();
    expect(screen.getByText('Captain America')).toBeInTheDocument();
  });
});
