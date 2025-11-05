import React from 'react';

const StethoscopeIcon: React.FC<{ className?: string }> = ({ className }) => (
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
        <path d="M4 18a2 2 0 1 0 4 0a2 2 0 1 0-4 0" />
        <path d="M6 18v-9a6 6 0 0 1 6-6v0a6 6 0 0 1 6 6v3" />
        <path d="M18 11.5a1.5 1.5 0 0 1 3 0a1.5 1.5 0 0 1-3 0" />
    </svg>
);

export default StethoscopeIcon;
