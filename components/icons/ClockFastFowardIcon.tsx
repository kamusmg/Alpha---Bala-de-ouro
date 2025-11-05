// components/icons/ClockFastFowardIcon.tsx
import React from 'react';

const ClockFastFowardIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className || "h-8 w-8"}
    >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
        <path d="m17 2-4 4 4 4" />
        <path d="m22 2-4 4 4 4" />
    </svg>
);

export default ClockFastFowardIcon;
