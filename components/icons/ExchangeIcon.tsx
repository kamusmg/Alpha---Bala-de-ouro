// components/icons/ExchangeIcon.tsx
import React from 'react';

const ExchangeIcon: React.FC<{ className?: string }> = ({ className }) => (
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
        className={className || "h-6 w-6"}
    >
        <path d="m15 5-4 4 4 4" />
        <path d="m9 19 4-4-4-4" />
    </svg>
);

export default ExchangeIcon;