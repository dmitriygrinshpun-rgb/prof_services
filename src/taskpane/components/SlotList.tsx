import React from 'react';
import { TimeSlot } from '../hooks/useAvailability';

interface SlotListProps {
  slots: TimeSlot[];
  loading: boolean;
  selectedIds: string[];
  onToggle: (id: string) => void;
  error?: string | null;
}

export const SlotList: React.FC<SlotListProps> = ({ slots, loading, selectedIds, onToggle, error }) => {
  if (loading) return <p className="loading-text">Finding your available slots…</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (slots.length === 0) return (
    <p className="error-message">No availability found in the next 7 days. Try adjusting your calendar.</p>
  );

  return (
    <div>
      <p className="section-label">Your available times</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {slots.map((slot) => {
          const selected = selectedIds.includes(slot.id);
          const [dayPart, timePart] = slot.label.split(', ');
          return (
            <div
              key={slot.id}
              className={`slot-card ${selected ? 'selected' : ''}`}
              onClick={() => onToggle(slot.id)}
            >
              <div className="slot-checkbox">
                <span className="slot-checkbox-inner">✓</span>
              </div>
              <div>
                <div className="slot-day">{dayPart}</div>
                <div className="slot-time">{timePart}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
