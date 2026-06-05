import { useState, useEffect } from 'react';

interface Recipient {
  displayName: string;
  emailAddress: string;
}

interface OfficeContextResult {
  recipients: Recipient[];
  subject: string;
}

export const useOfficeContext = (): OfficeContextResult => {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [subject, setSubject] = useState<string>('');

  useEffect(() => {
    const item = Office.context.mailbox.item;
    if (!item) return;

    const loadContext = () => {
      item.to.getAsync((result) => {
        if (result.status === 'succeeded') {
          setRecipients(
            result.value.map((r: { displayName: string; emailAddress: string }) => ({
              displayName: r.displayName,
              emailAddress: r.emailAddress,
            }))
          );
        }
      });

      item.subject.getAsync((result) => {
        if (result.status === 'succeeded') {
          setSubject(result.value || '');
        }
      });
    };

    loadContext();

    // Re-read when recipients change
    if (item.addHandlerAsync) {
      item.addHandlerAsync(
        Office.EventType.RecipientsChanged,
        loadContext
      );
    }
  }, []);

  return { recipients, subject };
};
