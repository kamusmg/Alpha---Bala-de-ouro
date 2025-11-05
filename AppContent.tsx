import React, { useState } from 'react';
import Header from './components/Header';
import AICoreMonitor from './components/AICoreMonitor';
import Chatbot from './components/Chatbot';
import { useData } from './contexts/DataContext';
import PresentDayDashboard from './components/PresentDayDashboard';
import BacktestAnalysisLoader from './components/BacktestAnalysisLoader';
import AdvancedMonitoringLoader from './components/AdvancedMonitoringLoader';
import TradingDesk from './components/TradingDesk';
import GlobalPerformanceLoader from './components/GlobalPerformanceLoader';
import NotificationToasts from './components/NotificationToast';
import MonitorIcon from './components/MonitorIcon';
import HistoryIcon from './components/HistoryIcon';
import SparklesIcon from './components/SparklesIcon';
import ShieldCheckIcon from './components/ShieldCheckIcon';
import ShieldZapIcon from './components/icons/ShieldZapIcon';
import VereditoDoDia from './components/VereditoDoDia';

type Tab = 'present' | 'backtest' | 'advanced' | 'desk' | 'performance';

const AppContent: React.FC = () => {
    const { 
        presentDayData, 
        backtestData, 
        isRecalculating, 
        loadPresentDayData 
    } = useData();

    const [activeTab, setActiveTab] = useState<Tab>('present');

    const handleRecalculate = () => {
        loadPresentDayData(true); // force refresh
    };

    const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
        { id: 'present', label: 'Visão Geral', icon: <MonitorIcon className="h-5 w-5" /> },
        { id: 'backtest', label: 'Backtest & Evolução', icon: <HistoryIcon className="h-5 w-5" /> },
        { id: 'advanced', label: 'Oportunidades Avançadas', icon: <SparklesIcon className="h-5 w-5" /> },
        { id: 'desk', label: 'Mesa de Operações', icon: <ShieldCheckIcon className="h-5 w-5" /> },
        { id: 'performance', label: 'Performance Global', icon: <ShieldZapIcon className="h-5 w-5" /> },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'present': return <PresentDayDashboard />;
            case 'backtest': return <BacktestAnalysisLoader />;
            case 'advanced': return <AdvancedMonitoringLoader />;
            case 'desk': return <TradingDesk />;
            case 'performance': return <GlobalPerformanceLoader />;
            default: return <PresentDayDashboard />;
        }
    };

    return (
        <div className="bg-background min-h-screen">
            <Header onRecalculate={handleRecalculate} isRecalculating={isRecalculating} />
            <main className="container mx-auto px-4 py-8">
                <div className="space-y-8">
                    <VereditoDoDia />
                    {/* <AICoreMonitor presentDayData={presentDayData} backtestData={backtestData} /> */}
                    
                    <div className="border-b border-border/50">
                        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`${
                                        activeTab === tab.id
                                            ? 'border-primary text-primary'
                                            : 'border-transparent text-text-secondary hover:text-white hover:border-border'
                                    } group inline-flex items-center gap-2 py-3 px-1 border-b-2 font-semibold text-sm transition-colors`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div>
                        {renderContent()}
                    </div>
                </div>
            </main>
            <NotificationToasts />
            <Chatbot />
        </div>
    );
};

export default AppContent;