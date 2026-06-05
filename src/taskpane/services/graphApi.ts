export const getFreeBusy = async (
  graphToken: string,
  start: string,
  end: string
): Promise<{ value: { start: { dateTime: string }; end: { dateTime: string }; showAs: string }[] }> => {
  const res = await fetch(
    `https://graph.microsoft.com/v1.0/me/calendarView?startDateTime=${encodeURIComponent(start)}&endDateTime=${encodeURIComponent(end)}&$select=start,end,showAs`,
    { headers: { Authorization: `Bearer ${graphToken}` } }
  );
  if (!res.ok) throw new Error('Graph API request failed');
  return res.json();
};
