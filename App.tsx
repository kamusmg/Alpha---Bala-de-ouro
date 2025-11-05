import React, { Suspense } from 'react';
// FIX: Corrected import path for DataContext
import { DataProvider } from './contexts/DataContext';
import { apiClient } from './services/api/bootstrap';
import LoadingSpinner from './components/LoadingSpinner';
// FIX: Corrected import path for AppContent
import AppContent from './AppContent'; 

const App: React.FC = () => {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <DataProvider apiClient={apiClient}>
                <AppContent />
            </DataProvider>
        </Suspense>
    );
};

export default App;
