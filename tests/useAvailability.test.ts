import { renderHook, waitFor } from '@testing-library/react';
import { useAvailability } from '../src/taskpane/hooks/useAvailability';
import { doodleApi } from '../src/taskpane/services/doodleApi';

jest.mock('../src/taskpane/services/doodleApi');

const mockGetSlots = doodleApi.getAvailableSlots as jest.Mock;

describe('useAvailability', () => {
  it('returns slots after fetch', async () => {
    const mockSlots = [
      { id: 'slot_1', start: '2026-06-10T14:00:00Z', end: '2026-06-10T14:30:00Z', label: 'Tue 10 Jun, 2:00 – 2:30 PM' },
    ];
    mockGetSlots.mockResolvedValueOnce({ slots: mockSlots });

    const { result } = renderHook(() => useAvailability(30, 'test-token'));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.slots).toHaveLength(1);
    expect(result.current.error).toBeNull();
  });

  it('sets error on fetch failure', async () => {
    mockGetSlots.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useAvailability(30, 'test-token'));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toContain('Could not load your availability');
  });
});
