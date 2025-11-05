// components/icons/TrendingSidewaysIcon.tsx
import React from 'react';

const TrendingSidewaysIcon: React.FC<{ className?: string }> = ({ className }) => (
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
        <polyline points="22 12 18 12 15 15 9 9 6 12 2 12" />
    </svg>
);

export default TrendingSidewaysIcon;
