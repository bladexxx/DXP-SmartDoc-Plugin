import React, { useState, useEffect, useRef } from 'react';
import { Icon } from './Icon';
import { ICONS } from '../constants';

const DropdownItem: React.FC<{ icon: string; label: string; onClick: () => void; primary?: boolean }> = ({ icon, label, onClick, primary = false }) => (
    <button
        onClick={onClick}
        className={`flex items-center w-full px-4 py-2 text-sm text-left ${primary ? 'text-nifi-accent' : 'text-nifi-text'} hover:bg-gray-100`}
        role="menuitem"
    >
        <Icon path={icon} className="w-5 h-5 mr-3" />
        <span>{label}</span>
    </button>
);

// Custom hook to handle clicks outside a specified element
const useOutsideAlerter = (ref: React.RefObject<HTMLDivElement>, close: () => void) => {
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                close();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, close]);
}


export const ActionsPanel: React.FC = () => {
    const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
    const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);
    
    const exportDropdownRef = useRef<HTMLDivElement>(null);
    const actionsDropdownRef = useRef<HTMLDivElement>(null);

    const handleAction = (actionName: string) => {
        alert(`Triggered action: ${actionName}`);
        setIsExportMenuOpen(false);
        setIsActionsMenuOpen(false);
    };

    useOutsideAlerter(exportDropdownRef, () => setIsExportMenuOpen(false));
    useOutsideAlerter(actionsDropdownRef, () => setIsActionsMenuOpen(false));


    return (
        <div className="sticky bottom-0 bg-nifi-surface/80 backdrop-blur-sm border-t border-gray-200 p-4 mt-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-2">
                
                {/* Export & Notify Dropdown Group */}
                <div className="relative inline-block text-left" ref={exportDropdownRef}>
                    <div>
                        <button
                            type="button"
                            className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-nifi-text hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-nifi-accent"
                            onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                        >
                            Export &amp; Notify
                            <Icon path={ICONS.chevronDown} className="w-5 h-5 ml-2 -mr-1" />
                        </button>
                    </div>

                    {isExportMenuOpen && (
                        <div
                            className="origin-bottom-left absolute left-0 bottom-full mb-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                            role="menu"
                            aria-orientation="vertical"
                        >
                            <div className="py-1" role="none">
                                <DropdownItem icon={ICONS.csv} label="Export CSV" onClick={() => handleAction('Export CSV')} />
                                <DropdownItem icon={ICONS.excel} label="Export Excel" onClick={() => handleAction('Export Excel')} />
                                <DropdownItem icon={ICONS.email} label="Send Email" onClick={() => handleAction('Send Email')} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Trigger Actions Dropdown Group */}
                <div className="relative inline-block text-left" ref={actionsDropdownRef}>
                    <div>
                        <button
                            type="button"
                            className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-nifi-accent text-sm font-medium text-white hover:bg-nifi-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nifi-accent"
                            onClick={() => setIsActionsMenuOpen(!isActionsMenuOpen)}
                        >
                            Trigger Actions
                            <Icon path={ICONS.chevronDown} className="w-5 h-5 ml-2 -mr-1" />
                        </button>
                    </div>

                    {isActionsMenuOpen && (
                        <div
                            className="origin-bottom-right absolute right-0 bottom-full mb-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                            role="menu"
                            aria-orientation="vertical"
                        >
                            <div className="py-1" role="none">
                                <DropdownItem icon={ICONS.play} label="AutoQuote" onClick={() => handleAction('AutoQuote')} primary />
                                <DropdownItem icon={ICONS.play} label="AutoVouch" onClick={() => handleAction('AutoVouch')} primary />
                                <DropdownItem icon={ICONS.play} label="AutoBilling" onClick={() => handleAction('AutoBilling')} primary />
                                <DropdownItem icon={ICONS.play} label="AutoSPA" onClick={() => handleAction('AutoSPA')} primary />
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};