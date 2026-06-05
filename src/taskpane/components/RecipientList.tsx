import React from 'react';

interface Recipient {
  displayName: string;
  emailAddress: string;
}

interface RecipientListProps {
  recipients: Recipient[];
}

export const RecipientList: React.FC<RecipientListProps> = ({ recipients }) => (
  <div>
    <p className="section-label">Scheduling with</p>
    {recipients.length === 0 ? (
      <p className="empty-recipients">Add recipients to your email to see who you're scheduling with.</p>
    ) : (
      <div className="recipient-chips">
        {recipients.map((r) => (
          <span key={r.emailAddress} className="recipient-chip" title={r.emailAddress}>
            {r.displayName || r.emailAddress}
          </span>
        ))}
      </div>
    )}
  </div>
);
