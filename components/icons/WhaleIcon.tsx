// components/icons/WhaleIcon.tsx
import React from 'react';

const WhaleIcon: React.FC<{ className?: string }> = ({ className }) => (
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
        <path d="M17.28 9.22a4.4 4.4 0 0 0-3.53 1.47 4.4 4.4 0 0 0-3.53-1.47 4.42 4.42 0 0 0-4.22 4.22c0 3.1 3.14 4.22 4.22 4.22a4.42 4.42 0 0 0 3.53-1.47 4.42 4.42 0 0 0 3.53 1.47c1.08 0 4.22-1.12 4.22-4.22a4.42 4.42 0 0 0-4.22-4.22Z" />
        <path d="M18 13.43V21" />
        <path d="M21 16.5c-2.5-1-4.82-1-7-1s-4.5 0-7 1" />
        <path d="M16 3.5c-2.36 0-4.28 1.92-4.28 4.28" />
        <path d="M6 13.43V21" />
    </svg>
);

export default WhaleIcon;