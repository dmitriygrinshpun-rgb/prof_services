import { renderHook, act } from '@testing-library/react';
import { OfficeMockObject } from '@microsoft/office-addin-mock';

const mockData = {
  context: {
    mailbox: {
      item: {
        to: {
          getAsync: jest.fn((cb: Function) =>
            cb({ status: 'succeeded', value: [{ displayName: 'Sarah Johnson', emailAddress: 'sarah@test.com' }] })
          ),
        },
        subject: {
          getAsync: jest.fn((cb: Function) => cb({ status: 'succeeded', value: 'Project Kickoff' })),
        },
        addHandlerAsync: jest.fn(),
      },
    },
  },
};

const officeMock = new OfficeMockObject(mockData);
(global as any).Office = officeMock;

import { useOfficeContext } from '../src/taskpane/hooks/useOfficeContext';

describe('useOfficeContext', () => {
  it('reads recipients and subject from mailbox item', async () => {
    const { result } = renderHook(() => useOfficeContext());

    await act(async () => {});

    expect(result.current.recipients).toHaveLength(1);
    expect(result.current.recipients[0].emailAddress).toBe('sarah@test.com');
    expect(result.current.subject).toBe('Project Kickoff');
  });
});
