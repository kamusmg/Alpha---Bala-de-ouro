// components/icons/RadarIcon.tsx
import React from 'react';

const RadarIcon: React.FC<{ className?: string }> = ({ className }) => (
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
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
        <path d="M12 2v10" className="animate-[spin_4s_linear_infinite]" style={{ transformOrigin: 'center' }} />

    </svg>
);

export default RadarIcon;