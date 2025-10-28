import React from 'react';
import { Icon } from './Icon';
import { ICONS } from '../constants';

export const Header: React.FC = () => {
    return (
        <header className="h-16 bg-nifi-surface border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
            <h2 className="text-lg font-semibold text-nifi-text">DXP-SmartDoc Plugin</h2>
            <div className="flex items-center space-x-4">
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <Icon path={ICONS.help} className="w-6 h-6 text-nifi-text-light" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <Icon path={ICONS.settings} className="w-6 h-6 text-nifi-text-light" />
                </button>
                <div className="w-8 h-8 rounded-full bg-nifi-accent flex items-center justify-center text-white font-bold text-sm">
                    U
                </div>
            </div>
        </header>
    );
};