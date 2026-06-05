import React, { useState, useEffect } from 'react';
import { RecipientList } from './RecipientList';
import { DurationPicker } from './DurationPicker';
import { SlotList } from './SlotList';
import { LinkInserted } from './LinkInserted';
import { useOfficeContext } from '../hooks/useOfficeContext';
import { useAvailability } from '../hooks/useAvailability';
import { useSchedulingLink } from '../hooks/useSchedulingLink';

type Duration = 15 | 30 | 45 | 60;

export const SchedulerPanel: React.FC<{ token: string }> = ({ token }) => {
  const [duration, setDuration] = useState<Duration>(30);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [linkUrl, setLinkUrl] = useState<string | null>(null);
  const [insertError, setInsertError] = useState<string | null>(null);

  const { recipients, subject } = useOfficeContext();
  const { slots, loading: slotsLoading, error: slotsError } = useAvailability(duration, token);
  const { generateLink, inserting } = useSchedulingLink(token);

  useEffect(() => {
    if (slots.length > 0) {
      setSelectedSlots(slots.map((s) => s.id));
    }
  }, [slots]);

  const handleInsert = async () => {
    setInsertError(null);
    const url = await generateLink({
      slots: slots.filter((s) => selectedSlots.includes(s.id)),
      duration,
      recipients,
      subject,
    });

    if (!url) {
      setInsertError('Something went wrong. Please try again.');
      return;
    }

    Office.context.mailbox.item!.body.getAsync(
      Office.CoercionType.Html,
      (bodyResult) => {
        const currentBody = bodyResult.value || '';
        const linkHtml = `
          <br/><br/>
          <a href="${url}" style="color:#9B5DE5;font-weight:bold;">
            📅 Pick a time to meet — click here
          </a>
          <br/>
          <span style="color:#666;font-size:12px;">
            Powered by Doodle · No account needed
          </span>
        `;
        Office.context.mailbox.item!.body.setAsync(
          currentBody + linkHtml,
          { coercionType: Office.CoercionType.Html },
          () => setLinkUrl(url)
        );
      }
    );
  };

  if (linkUrl) {
    return <LinkInserted url={linkUrl} onEdit={() => setLinkUrl(null)} />;
  }

  return (
    <div className="scheduler-panel">
      <div className="panel-header">
        <div className="doodle-dot" />
        <span className="panel-title">Schedule a Meeting</span>
      </div>
      <RecipientList recipients={recipients} />
      <DurationPicker value={duration} onChange={setDuration} />
      <SlotList
        slots={slots}
        loading={slotsLoading}
        selectedIds={selectedSlots}
        error={slotsError}
        onToggle={(id) =>
          setSelectedSlots((prev) =>
            prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
          )
        }
      />
      {insertError && <p className="error-message">{insertError}</p>}
      <button
        onClick={handleInsert}
        disabled={selectedSlots.length === 0 || inserting}
        className="insert-btn"
      >
        {inserting ? 'Adding to email…' : 'Insert scheduling link'}
      </button>
    </div>
  );
};
