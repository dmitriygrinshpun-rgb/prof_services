import { useState, useEffect } from 'react';
import { getOfficeToken } from '../services/auth';

interface UseAuthResult {
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: () => Promise<void>;
}

export const useAuth = (): UseAuthResult => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const login = async () => {
    setLoading(true);
    setError(null);
    try {
      const t = await getOfficeToken();
      setToken(t);
    } catch (err) {
      setError('Sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Attempt silent SSO on mount
    login();
  }, []);

  return {
    isAuthenticated: !!token,
    token,
    loading,
    error,
    login,
  };
};
