import React, { useState, useEffect, useRef } from 'react';
// FIX: Corrected import path for DataContext
import { useData } from '../contexts/DataContext';
// FIX: Corrected import path for translations
import { translations } from '../utils/translations';
import { DateTime } from 'luxon';
import BellIcon from './icons/BellIcon';
import XIcon from './icons/XIcon';
import CheckIcon from './CheckIcon';
import SparklesIcon from './SparklesIcon';
import ActivityIcon from './icons/ActivityIcon';

const NotificationCenter: React.FC = () => {
    const { notifications, markAllNotificationsAsRead, clearAllNotifications } = useData();
    const t = translations.pt;
    const language = 'pt'; // Assuming 'pt' for luxon locale

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getIcon = (type: string) => {
        switch (type) {
            case 'new_top_signal': return <SparklesIcon className="h-5 w-5 text-yellow-400" />;
            case 'positions_opened': return <ActivityIcon className="h-5 w-5 text-green-400" />;
            default: return <BellIcon className="h-5 w-5 text-blue-400" />;
        }
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="relative p-2 text-text-secondary hover:text-white rounded-full hover:bg-border transition-colors"
                aria-label="Open notifications"
            >
                <BellIcon className="h-6 w-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-danger ring-2 ring-surface text-white text-xs font-bold flex items-center justify-center" style={{fontSize: '0.6rem'}}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-surface border border-border rounded-lg shadow-2xl z-50">
                    <div className="p-3 flex justify-between items-center border-b border-border">
                        {/* FIX: Use correct translation key */}
                        <h4 className="font-bold text-white">{t.notificationsTitle}</h4>
                        <button onClick={() => setIsOpen(false)} className="p-1 text-text-secondary hover:text-white">
                            <XIcon className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-background">
                        {notifications.length === 0 ? (
                            // FIX: Use correct translation key
                            <p className="text-center text-text-secondary text-sm py-8">{t.noNotifications}</p>
                        ) : (
                            [...notifications].reverse().map(n => (
                                <div key={n.id} className={`p-3 border-b border-border/50 flex gap-3 ${!n.read ? 'bg-primary/5' : ''}`}>
                                    <div className="flex-shrink-0 mt-1">{getIcon(n.type)}</div>
                                    <div>
                                        <p className="text-sm text-text leading-snug">{n.message}</p>
                                        <p className="text-xs text-text-secondary mt-1">{DateTime.fromISO(n.timestamp).setLocale(language).toRelative()}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    {notifications.length > 0 && (
                        <div className="p-2 bg-background/50 flex justify-between text-xs font-semibold">
                            <button onClick={markAllNotificationsAsRead} className="text-blue-400 hover:text-blue-300 flex items-center gap-1">
                                <CheckIcon className="h-4 w-4" />
                                {/* FIX: Use correct translation key */}
                                {t.markAllAsRead}
                            </button>
                            <button onClick={clearAllNotifications} className="text-red-400 hover:text-red-300">
                                {/* FIX: Use correct translation key */}
                                {t.clearAll}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationCenter;
