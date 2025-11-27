import { render, screen, waitFor } from '@testing-library/react';
import Workouts from './Workouts';

global.fetch = jest.fn();

describe('Workouts Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders workouts heading after loading', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => []
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => []
      });
    
    render(<Workouts />);
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Workouts/i })).toBeInTheDocument();
    });
  });

  test('displays workouts with suggested teams', async () => {
    const mockWorkouts = [
      { id: 1, name: 'HIIT Training', description: 'High intensity', suggested_for: [1, 2] }
    ];
    const mockTeams = [
      { id: 1, name: 'Marvel' },
      { id: 2, name: 'DC' }
    ];

    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockWorkouts
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockTeams
      });

    render(<Workouts />);

    await waitFor(() => {
      expect(screen.getByText('HIIT Training')).toBeInTheDocument();
    });
    expect(screen.getByText('High intensity')).toBeInTheDocument();
    expect(screen.getByText('Marvel')).toBeInTheDocument();
    expect(screen.getByText('DC')).toBeInTheDocument();
  });
});
