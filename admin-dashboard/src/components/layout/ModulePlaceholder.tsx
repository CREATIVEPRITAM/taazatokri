import React from 'react';
import { Layers } from 'lucide-react';

interface ModulePlaceholderProps {
  title: string;
}

export const ModulePlaceholder: React.FC<ModulePlaceholderProps> = ({ title }) => {
  return (
    <div className="module-placeholder-card">
      <div className="placeholder-badge">
        <Layers size={14} />
        <span>TaazaTokari V1 Module</span>
      </div>
      <h2 className="placeholder-title">{title}</h2>
      <p className="placeholder-desc">
        Module implementation will be added in a later step.
      </p>
    </div>
  );
};
