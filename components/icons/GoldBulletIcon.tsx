import React from 'react';

const GoldBulletIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={className || "h-5 w-5"} 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        stroke="currentColor" 
        strokeWidth="1"
    >
        <path d="M12 2l2.35 7.16h7.53l-6.09 4.42 2.35 7.17-6.14-4.42-6.14 4.42 2.35-7.17-6.09-4.42h7.53L12 2z"/>
    </svg>
);

export default GoldBulletIcon;
