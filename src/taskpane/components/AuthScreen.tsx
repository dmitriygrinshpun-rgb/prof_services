import React from 'react';

interface AuthScreenProps {
  onLogin: () => Promise<void>;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await onLogin();
    } catch {
      setError('Sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen scheduler-panel">
      <div>
        <div className="panel-header" style={{ justifyContent: 'center' }}>
          <div className="doodle-dot" />
          <span className="panel-title">Doodle Scheduler</span>
        </div>
      </div>
      <p className="auth-subtitle">
        Sign in with your Microsoft account to schedule meetings from Outlook.
      </p>
      {error && <p className="error-message">{error}</p>}
      <button className="msft-btn" onClick={handleLogin} disabled={loading}>
        {loading ? 'Signing in…' : '🔑 Sign in with Microsoft'}
      </button>
    </div>
  );
};
