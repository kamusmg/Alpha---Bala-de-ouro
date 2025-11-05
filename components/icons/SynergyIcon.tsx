import React from 'react';

const SynergyIcon: React.FC<{ className?: string }> = ({ className }) => (
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
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
        <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0" />
        <path d="M12 2v4" />
        <path d="M12 18v4" />
        <path d="M22 12h-4" />
        <path d="M6 12H2" />
    </svg>
);

export default SynergyIcon;
