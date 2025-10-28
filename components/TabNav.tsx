import React from 'react';
import { View } from '../types';
import { Icon } from './Icon';
import { ICONS } from '../constants';

interface TabNavProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  onResetWizard: () => void;
}

const Tab: React.FC<{
    iconPath: string;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ iconPath, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center space-x-2 px-1 py-4 text-sm font-medium border-b-2 transition-colors duration-200
            ${
                isActive
                    ? 'border-nifi-accent text-nifi-accent'
                    : 'border-transparent text-nifi-text-light hover:text-nifi-text'
            }`}
    >
        <Icon path={iconPath} className="w-5 h-5" />
        <span>{label}</span>
    </button>
);


export const TabNav: React.FC<TabNavProps> = ({ currentView, setCurrentView, onResetWizard }) => {
  return (
    <nav className="flex space-x-8">
        <Tab
            iconPath={ICONS.parser}
            label="Document Parser"
            isActive={currentView === View.Parser}
            onClick={onResetWizard}
        />
        <Tab
            iconPath={ICONS.eye}
            label="Output Review & Actions"
            isActive={currentView === View.Review}
            onClick={() => setCurrentView(View.Review)}
        />
    </nav>
  );
};