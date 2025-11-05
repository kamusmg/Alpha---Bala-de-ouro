import React from 'react';

const AlienCoinIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={className || "h-6 w-6"} 
        viewBox="0 0 64 64" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5"
    >
        <circle cx="32" cy="32" r="28" strokeOpacity="0.5" />
        <path d="M32 12 C 42 22, 42 42, 32 52" strokeOpacity="0.8" />
        <path d="M32 12 C 22 22, 22 42, 32 52" strokeOpacity="0.8" />
        <path d="M20 32 Q 32 24 44 32" />
        <path d="M20 32 Q 32 40 44 32" />
        <circle cx="32" cy="32" r="4" fill="currentColor" />
    </svg>
);

export default AlienCoinIcon;
