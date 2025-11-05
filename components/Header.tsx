import React from 'react';
import Logo from './Logo';
import Clock from './Clock';
import NotificationCenter from './NotificationCenter';
import RefreshIcon from './RefreshIcon';
// FIX: Corrected import path for translations
import { translations } from '../utils/translations';

interface HeaderProps {
    onRecalculate: () => void;
    isRecalculating: boolean;
}

const Header: React.FC<HeaderProps> = ({ onRecalculate, isRecalculating }) => {
    const t = translations.pt;
    return (
        <header className="bg-surface/50 backdrop-blur-lg border-b border-border/50 sticky top-0 z-40">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Logo title="ALPHA ENGINE" subtitle="v10.0" />
                <div className="flex items-center gap-4">
                    <button
                        onClick={onRecalculate}
                        disabled={isRecalculating}
                        className="flex items-center gap-2 text-sm font-semibold bg-primary/20 text-primary px-3 py-1.5 rounded-lg hover:bg-primary/30 transition-colors disabled:opacity-50 disabled:cursor-wait"
                        title="Recalcular Análise"
                    >
                        <RefreshIcon className={`h-4 w-4 ${isRecalculating ? 'animate-spin' : ''}`} />
                        <span>{isRecalculating ? 'Recalculando...' : 'Recalcular'}</span>
                    </button>
                    <div className="h-8 w-px bg-border"></div>
                    <Clock />
                    <NotificationCenter />
                </div>
            </div>
        </header>
    );
};

export default Header;