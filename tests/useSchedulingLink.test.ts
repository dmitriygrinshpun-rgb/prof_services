import { renderHook, act } from '@testing-library/react';
import { useSchedulingLink } from '../src/taskpane/hooks/useSchedulingLink';
import { doodleApi } from '../src/taskpane/services/doodleApi';

jest.mock('../src/taskpane/services/doodleApi');

const mockCreateLink = doodleApi.createSchedulingLink as jest.Mock;

describe('useSchedulingLink', () => {
  it('returns URL on success', async () => {
    mockCreateLink.mockResolvedValueOnce({ url: 'https://doodle.com/bp/test', pollId: 'poll_1', expiresAt: '' });

    const { result } = renderHook(() => useSchedulingLink('test-token'));

    let url: string | null = null;
    await act(async () => {
      url = await result.current.generateLink({
        slots: [],
        duration: 30,
        recipients: [],
        subject: 'Test',
      });
    });

    expect(url).toBe('https://doodle.com/bp/test');
    expect(result.current.inserting).toBe(false);
  });

  it('returns null on error', async () => {
    mockCreateLink.mockRejectedValueOnce(new Error('Failed'));

    const { result } = renderHook(() => useSchedulingLink('test-token'));

    let url: string | null = 'initial';
    await act(async () => {
      url = await result.current.generateLink({ slots: [], duration: 30, recipients: [], subject: 'Test' });
    });

    expect(url).toBeNull();
  });
});
