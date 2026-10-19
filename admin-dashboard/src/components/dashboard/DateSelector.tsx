import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

export type DateRangeOption = 'today' | 'yesterday' | 'tomorrow';

export interface DateSelectorProps {
  selectedRange?: DateRangeOption;
  onChangeRange?: (range: DateRangeOption) => void;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  selectedRange: controlledRange,
  onChangeRange,
}) => {
  const [internalRange, setInternalRange] = useState<DateRangeOption>('today');

  const activeRange = controlledRange ?? internalRange;

  const handleSelect = (range: DateRangeOption) => {
    if (onChangeRange) {
      onChangeRange(range);
    } else {
      setInternalRange(range);
    }
  };

  return (
    <div className="date-selector-wrapper" aria-label="Operational Date Range Selector">
      <button
        type="button"
        className={`date-selector-btn ${activeRange === 'today' ? 'active' : ''}`}
        onClick={() => handleSelect('today')}
        title="View today's operations"
      >
        <Calendar size={14} />
        <span>Today</span>
      </button>

      <button
        type="button"
        className={`date-selector-btn ${activeRange === 'tomorrow' ? 'active' : ''}`}
        onClick={() => handleSelect('tomorrow')}
        title="View tomorrow's morning fulfillment schedule"
      >
        <span>Tomorrow</span>
      </button>

      <button
        type="button"
        className={`date-selector-btn ${activeRange === 'yesterday' ? 'active' : ''}`}
        onClick={() => handleSelect('yesterday')}
        title="View yesterday's settled operations"
      >
        <span>Yesterday</span>
      </button>
    </div>
  );
};
