import React from 'react';

interface LinkInsertedProps {
  url: string;
  onEdit: () => void;
}

export const LinkInserted: React.FC<LinkInsertedProps> = ({ url, onEdit }) => (
  <div className="scheduler-panel">
    <div className="confirmation-screen">
      <div className="check-icon">✓</div>
      <p style={{ fontWeight: 700, fontSize: '16px' }}>Scheduling link added!</p>
      <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
        Recipients can click the link in your email to pick a time — no account needed.
      </p>
      <div className="link-preview">{url}</div>
      <button className="secondary-btn" onClick={onEdit}>
        Change slots
      </button>
    </div>
  </div>
);
