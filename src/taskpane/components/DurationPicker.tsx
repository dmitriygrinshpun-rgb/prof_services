import React from 'react';

type Duration = 15 | 30 | 45 | 60;

interface DurationPickerProps {
  value: Duration;
  onChange: (d: Duration) => void;
}

const DURATIONS: Duration[] = [15, 30, 45, 60];

export const DurationPicker: React.FC<DurationPickerProps> = ({ value, onChange }) => (
  <div>
    <p className="section-label">Meeting duration</p>
    <div className="duration-group">
      {DURATIONS.map((d) => (
        <button
          key={d}
          className={`duration-btn ${value === d ? 'active' : ''}`}
          onClick={() => onChange(d)}
        >
          {d} min
        </button>
      ))}
    </div>
  </div>
);
