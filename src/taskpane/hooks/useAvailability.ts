import { useState, useEffect } from 'react';
import { doodleApi } from '../services/doodleApi';

export interface TimeSlot {
  id: string;
  start: string;
  end: string;
  label: string;
}

interface UseAvailabilityResult {
  slots: TimeSlot[];
  loading: boolean;
  error: string | null;
}

export const useAvailability = (duration: number, token: string): UseAvailabilityResult => {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    doodleApi
      .getAvailableSlots({ duration, token })
      .then((res) => {
        if (!cancelled) {
          setSlots(res.slots);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Could not load your availability. Please try again.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [duration, token]);

  return { slots, loading, error };
};
