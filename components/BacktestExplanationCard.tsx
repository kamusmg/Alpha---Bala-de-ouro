import React from 'react';
import TimeAstronautIcon from './TimeAstronautIcon';
// FIX: Corrected import path for translations
import { translations } from '../utils/translations';

const BacktestExplanationCard: React.FC = () => {
    const t = translations.pt;

    return (
        <div className="bg-surface/50 border border-border/50 rounded-xl p-6 mb-12 flex flex-col sm:flex-row gap-6 items-center">
            <div className="flex-shrink-0">
                <TimeAstronautIcon className="h-20 w-20 text-primary" />
            </div>
            <div>
                {/* FIX: Use correct translation key */}
                <h3 className="text-xl font-bold text-primary mb-2">{t.backtestTitle}</h3>
                <p className="text-text-secondary leading-relaxed">
                    {/* FIX: Use correct translation key */}
                    {t.backtestContent}
                </p>
            </div>
        </div>
    );
};

export default BacktestExplanationCard;