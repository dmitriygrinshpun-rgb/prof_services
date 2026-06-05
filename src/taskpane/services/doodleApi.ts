export interface SlotResult {
  id: string;
  start: string;
  end: string;
  label: string;
}

export interface AvailableSlotsResponse {
  slots: SlotResult[];
}

export interface CreateLinkParams {
  slots: { id: string; start: string; end: string }[];
  duration: number;
  recipients: { displayName: string; emailAddress: string }[];
  subject: string;
  token: string;
}

export interface CreateLinkResponse {
  url: string;
  pollId: string;
  expiresAt: string;
}

const BASE_URL = process.env.DOODLE_API_BASE_URL || 'https://api.doodle.com';

export const doodleApi = {
  getAvailableSlots: async ({
    duration,
    token,
  }: {
    duration: number;
    token: string;
  }): Promise<AvailableSlotsResponse> => {
    const now = new Date();
    const weekOut = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const res = await fetch(
      `${BASE_URL}/v2/scheduling/available-slots?duration=${duration}&start=${encodeURIComponent(now.toISOString())}&end=${encodeURIComponent(weekOut.toISOString())}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) throw new Error('Availability fetch failed');
    return res.json();
  },

  createSchedulingLink: async ({
    slots,
    duration,
    recipients,
    subject,
    token,
  }: CreateLinkParams): Promise<CreateLinkResponse> => {
    const res = await fetch(`${BASE_URL}/v2/scheduling/links`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: subject || 'Meeting',
        duration,
        slots: slots.map((s) => ({ start: s.start, end: s.end })),
        invitees: recipients.map((r) => ({ name: r.displayName, email: r.emailAddress })),
      }),
    });
    if (!res.ok) throw new Error('Link creation failed');
    return res.json();
  },
};
