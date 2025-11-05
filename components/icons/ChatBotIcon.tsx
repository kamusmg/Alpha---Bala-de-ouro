import React from 'react';

const ChatBotIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className || "h-6 w-6"}
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M4 17.5v-11a3.5 3.5 0 0 1 7 0v11a3.5 3.5 0 0 1 -7 0z" />
        <path d="M13 5.5v11a3.5 3.5 0 0 0 7 0v-11a3.5 3.5 0 0 0 -7 0z" />
        <path d="M4 14h7" />
        <path d="M13 14h7" />
        <path d="M10 5l-1 -1l-1 1" />
        <path d="M17 5l-1 -1l-1 1" />
        <path d="M7.5 10.5a.5 .5 0 0 1 .5 -.5h.5a.5 .5 0 0 1 .5 .5v.5a.5 .5 0 0 1 -.5 .5h-.5a.5 .5 0 0 1 -.5 -.5z" />
        <path d="M16.5 10.5a.5 .5 0 0 1 .5 -.5h.5a.5 .5 0 0 1 .5 .5v.5a.5 .5 0 0 1 -.5 .5h-.5a.5 .5 0 0 1 -.5 -.5z" />
    </svg>
);

export default ChatBotIcon;
