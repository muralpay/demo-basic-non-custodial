import React from 'react';
import { Button } from './Button';

export interface LogContainerProps {
  log: string[];
  onClear: () => void;
  className?: string;
}

export const LogContainer: React.FC<LogContainerProps> = ({
  log,
  onClear,
  className = ''
}) => {
  const containerStyles = {
    backgroundColor: 'white',
    borderRadius: '12px',
    marginBottom: '30px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    overflow: 'hidden'
  };

  const headerStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e2e8f0'
  };

  const titleStyles = {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0
  };

  const contentStyles = {
    maxHeight: '300px',
    overflowY: 'auto' as const,
    padding: '15px 20px',
    backgroundColor: '#1e293b',
    color: '#e2e8f0',
    fontFamily: 'Monaco, Consolas, "Lucida Console", monospace',
    fontSize: '0.875rem',
    lineHeight: '1.5'
  };

  const entryStyles = {
    margin: '2px 0',
    wordBreak: 'break-word' as const
  };

  return (
    <div style={containerStyles} className={className}>
      <div style={headerStyles}>
        <h3 style={titleStyles}>📊 Activity Log</h3>
        <Button 
          onClick={onClear}
          variant="danger"
          size="small"
        >
          Clear Log
        </Button>
      </div>
      <div style={contentStyles}>
        {log.map((entry, index) => (
          <div key={index} style={entryStyles}>{entry}</div>
        ))}
      </div>
    </div>
  );
}; 