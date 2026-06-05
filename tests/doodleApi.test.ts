import { doodleApi } from '../src/taskpane/services/doodleApi';

global.fetch = jest.fn();

const mockFetch = global.fetch as jest.Mock;

beforeEach(() => {
  mockFetch.mockReset();
  process.env.DOODLE_API_BASE_URL = 'https://api.doodle.com';
});

describe('doodleApi.getAvailableSlots', () => {
  it('returns slots on success', async () => {
    const mockSlots = {
      slots: [{ id: 'slot_1', start: '2026-06-10T14:00:00Z', end: '2026-06-10T14:30:00Z', label: 'Tue 10 Jun, 2:00 – 2:30 PM' }],
    };
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => mockSlots });

    const result = await doodleApi.getAvailableSlots({ duration: 30, token: 'test-token' });
    expect(result.slots).toHaveLength(1);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('duration=30'),
      expect.objectContaining({ headers: { Authorization: 'Bearer test-token' } })
    );
  });

  it('throws on non-ok response', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });
    await expect(doodleApi.getAvailableSlots({ duration: 30, token: 'test-token' })).rejects.toThrow('Availability fetch failed');
  });
});

describe('doodleApi.createSchedulingLink', () => {
  it('returns url and pollId on success', async () => {
    const mockResponse = { url: 'https://doodle.com/bp/test', pollId: 'poll_1', expiresAt: '2026-06-17T23:59:59Z' };
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => mockResponse });

    const result = await doodleApi.createSchedulingLink({
      slots: [{ id: 'slot_1', start: '2026-06-10T14:00:00Z', end: '2026-06-10T14:30:00Z' }],
      duration: 30,
      recipients: [{ displayName: 'Sarah', emailAddress: 'sarah@test.com' }],
      subject: 'Kickoff',
      token: 'test-token',
    });

    expect(result.url).toBe('https://doodle.com/bp/test');
    expect(result.pollId).toBe('poll_1');
  });

  it('throws on non-ok response', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });
    await expect(
      doodleApi.createSchedulingLink({
        slots: [],
        duration: 30,
        recipients: [],
        subject: 'Test',
        token: 'token',
      })
    ).rejects.toThrow('Link creation failed');
  });
});
