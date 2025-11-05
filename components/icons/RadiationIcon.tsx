import React from 'react';

const RadiationIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={className || "h-5 w-5"} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <path d="M12 12s-4.2-4.2-6-6M12 12s4.2 4.2 6 6M12 12s-4.2 4.2-6 6M12 12s4.2-4.2 6-6"/>
        <path d="M14.12 11.42A4.24 4.24 0 109.88 7.17M14.12 16.83A4.24 4.24 0 109.88 12.58"/>
        <path d="M16.83 9.88A4.24 4.24 0 1012.58 14.12"/>
        <circle cx="12" cy="12" r="10"/>
    </svg>
);

export default RadiationIcon;
