import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

export const DateSelector: React.FC = () => {
  const [selectedRange, setSelectedRange] = useState<'today' | 'yesterday' | 'tomorrow'>('today');

  return (
    <div className="date-selector-wrapper" aria-label="Operational Date Range Selector">
      <button
        type="button"
        className={`date-selector-btn ${selectedRange === 'today' ? 'active' : ''}`}
        onClick={() => setSelectedRange('today')}
        title="View today's operations"
      >
        <Calendar size={14} />
        <span>Today</span>
      </button>

      <button
        type="button"
        className={`date-selector-btn ${selectedRange === 'tomorrow' ? 'active' : ''}`}
        onClick={() => setSelectedRange('tomorrow')}
        title="View tomorrow's morning fulfillment schedule"
      >
        <span>Tomorrow</span>
      </button>

      <button
        type="button"
        className={`date-selector-btn ${selectedRange === 'yesterday' ? 'active' : ''}`}
        onClick={() => setSelectedRange('yesterday')}
        title="View yesterday's settled operations"
      >
        <span>Yesterday</span>
      </button>
    </div>
  );
};
