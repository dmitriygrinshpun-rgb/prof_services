import { useState } from 'react';
import { doodleApi } from '../services/doodleApi';
import { TimeSlot } from './useAvailability';

interface GenerateLinkParams {
  slots: TimeSlot[];
  duration: number;
  recipients: { displayName: string; emailAddress: string }[];
  subject: string;
}

interface UseSchedulingLinkResult {
  generateLink: (params: GenerateLinkParams) => Promise<string | null>;
  inserting: boolean;
  error: string | null;
}

export const useSchedulingLink = (token: string): UseSchedulingLinkResult => {
  const [inserting, setInserting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateLink = async ({
    slots,
    duration,
    recipients,
    subject,
  }: GenerateLinkParams): Promise<string | null> => {
    setInserting(true);
    setError(null);
    try {
      const result = await doodleApi.createSchedulingLink({
        slots,
        duration,
        recipients,
        subject,
        token,
      });
      return result.url;
    } catch {
      setError('Failed to create scheduling link.');
      return null;
    } finally {
      setInserting(false);
    }
  };

  return { generateLink, inserting, error };
};
