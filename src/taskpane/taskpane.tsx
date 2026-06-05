import React from 'react';
import ReactDOM from 'react-dom';
import './taskpane.css';
import { AuthScreen } from './components/AuthScreen';
import { SchedulerPanel } from './components/SchedulerPanel';
import { useAuth } from './hooks/useAuth';

const App: React.FC = () => {
  const { isAuthenticated, token, login, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="scheduler-panel">
        <p className="loading-text">Signing in…</p>
      </div>
    );
  }

  return (
    <div>
      {!isAuthenticated ? (
        <AuthScreen onLogin={login} />
      ) : (
        <SchedulerPanel token={token!} />
      )}
    </div>
  );
};

Office.onReady(() => {
  const root = document.getElementById('root');
  if (root) {
    ReactDOM.render(<App />, root);
  }
});
