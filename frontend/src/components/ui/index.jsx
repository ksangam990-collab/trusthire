import React from 'react';
import TrustScoreBadge from './TrustScoreBadge';

export { TrustScoreBadge };

export function Spinner({ className = 'h-4 w-4' }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
    />
  );
}

export default TrustScoreBadge;
