// components/skeletons/SilverBulletCardSkeleton.tsx
import React from 'react';
import AlienCoinIcon from '../icons/AlienCoinIcon';

const SilverBulletCardSkeleton: React.FC = () => {
    return (
        <div className="relative bg-gradient-to-tr from-gray-900 via-blue-900/50 to-background border-2 border-secondary/50 rounded-xl p-6 shadow-2xl shadow-secondary/20 overflow-hidden animate-pulse">
            <div className="absolute -top-16 -right-16 text-secondary/10">
                 <AlienCoinIcon className="w-64 h-64" />
            </div>
            <div className="relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start">
                    <div>
                        <div className="h-4 w-48 bg-border rounded-md mb-2"></div>
                        <div className="h-10 w-64 bg-border rounded-md"></div>
                    </div>
                    <div className="mt-4 md:mt-0 md:text-right">
                        <div className="h-4 w-24 bg-border rounded-md mb-2 ml-auto"></div>
                        <div className="h-14 w-40 bg-border rounded-md ml-auto"></div>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
                    <div className="md:col-span-2 text-center md:text-left">
                         <div className="h-5 w-3/4 bg-border rounded-md mx-auto md:mx-0 mb-2"></div>
                         <div className="h-16 w-full bg-border rounded-md"></div>
                    </div>
                    <div className="md:col-span-3 bg-background/50 border border-border/50 rounded-lg p-4 space-y-3 h-24">
                        <div className="h-4 w-full bg-border/50 rounded-md"></div>
                        <div className="h-4 w-full bg-border/50 rounded-md"></div>
                        <div className="h-4 w-full bg-border/50 rounded-md"></div>
                    </div>
                </div>

                <div className="mt-6">
                    <div className="h-5 w-32 bg-border rounded-md mb-2"></div>
                    <div className="h-4 w-full bg-border rounded-md"></div>
                    <div className="h-4 w-5/6 bg-border rounded-md mt-2"></div>
                </div>
                 
                <div className="mt-6 pt-4 border-t border-border/50 text-center">
                    <div className="h-12 w-64 bg-border/50 rounded-md mx-auto"></div>
                    <div className="h-4 w-48 bg-border/50 rounded-md mx-auto mt-2"></div>
                </div>

            </div>
        </div>
    );
};

export default SilverBulletCardSkeleton;