import React, { useState, useEffect, useRef } from 'react';
import { Icon } from './Icon';
import { ICONS } from '../constants';
import { TriggerConfigModal } from './TriggerConfigModal';
import { TriggerConfig } from '../types';

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
    const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
    const [selectedAction, setSelectedAction] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [feedback, setFeedback] = useState<{ status: 'Success' | 'Error'; message: string; link?: string } | null>(null);

    const exportDropdownRef = useRef<HTMLDivElement>(null);
    const actionsDropdownRef = useRef<HTMLDivElement>(null);

    useOutsideAlerter(exportDropdownRef, () => setIsExportMenuOpen(false));
    useOutsideAlerter(actionsDropdownRef, () => setIsActionsMenuOpen(false));

    const handleExportAction = (actionName: string) => {
        alert(`Triggered action: ${actionName}`);
        setIsExportMenuOpen(false);
    };

    const handleTriggerActionClick = (actionName: string) => {
        setFeedback(null);
        setSelectedAction(actionName);
        setIsConfigModalOpen(true);
        setIsActionsMenuOpen(false);
    };

    const handleTrigger = (config: TriggerConfig) => {
        setIsConfigModalOpen(false);
        setIsProcessing(true);
        console.log("Sending to Message Queue with config:", config);

        setTimeout(() => {
            setIsProcessing(false);
            setFeedback({
                status: 'Success',
                message: `Action "${config.actionName}" was successfully triggered.`,
                link: `https://metabase.example.com/dashboard/123?action=${config.actionName}&ts=${Date.now()}`
            });
        }, 2500);
    };
    
    const renderFeedback = () => {
        if (isProcessing) {
            return (
                <div className="text-sm text-nifi-text-light">
                    <span className="font-semibold">Processing...</span> Your request is being handled by NiFi.
                </div>
            );
        }
        if (feedback) {
            const isSuccess = feedback.status === 'Success';
            return (
                <div className={`flex items-center justify-between text-sm p-3 rounded-md ${isSuccess ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    <div>
                        <span className={`font-semibold`}>{feedback.status}:</span> {feedback.message}
                        {feedback.link && (
                             <a href={feedback.link} target="_blank" rel="noopener noreferrer" className="ml-2 font-semibold underline hover:opacity-80 inline-flex items-center">
                                View Metabase Dashboard
                                <Icon path={ICONS.link} className="w-4 h-4 ml-1"/>
                            </a>
                        )}
                    </div>
                    <button onClick={() => setFeedback(null)} className="p-1 rounded-full hover:bg-black/10 -mr-1">
                        <Icon path={ICONS.close} className="w-4 h-4"/>
                    </button>
                </div>
            );
        }
        return null;
    };

    return (
        <>
            <div className="sticky bottom-0 bg-nifi-surface/80 backdrop-blur-sm border-t border-gray-200 p-4 mt-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                       {renderFeedback()}
                    </div>

                    <div className="flex items-center justify-end gap-2 flex-shrink-0">
                        <div className="relative inline-block text-left" ref={exportDropdownRef}>
                            <div>
                                <button type="button" className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-nifi-text hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-nifi-accent" onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}>
                                    Export &amp; Notify
                                    <Icon path={ICONS.chevronDown} className="w-5 h-5 ml-2 -mr-1" />
                                </button>
                            </div>
                            {isExportMenuOpen && (
                                <div className="origin-bottom-left absolute left-0 bottom-full mb-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu">
                                    <div className="py-1" role="none">
                                        <DropdownItem icon={ICONS.csv} label="Export CSV" onClick={() => handleExportAction('Export CSV')} />
                                        <DropdownItem icon={ICONS.excel} label="Export Excel" onClick={() => handleExportAction('Export Excel')} />
                                        <DropdownItem icon={ICONS.email} label="Send Email" onClick={() => handleExportAction('Send Email')} />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="relative inline-block text-left" ref={actionsDropdownRef}>
                            <div>
                                <button type="button" className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-nifi-accent text-sm font-medium text-white hover:bg-nifi-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nifi-accent" onClick={() => setIsActionsMenuOpen(!isActionsMenuOpen)}>
                                    Trigger Actions
                                    <Icon path={ICONS.chevronDown} className="w-5 h-5 ml-2 -mr-1" />
                                </button>
                            </div>
                            {isActionsMenuOpen && (
                                <div className="origin-bottom-right absolute right-0 bottom-full mb-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu">
                                    <div className="py-1" role="none">
                                        <DropdownItem icon={ICONS.play} label="AutoQuote" onClick={() => handleTriggerActionClick('AutoQuote')} primary />
                                        <DropdownItem icon={ICONS.play} label="AutoVouch" onClick={() => handleTriggerActionClick('AutoVouch')} primary />
                                        <DropdownItem icon={ICONS.play} label="AutoBilling" onClick={() => handleTriggerActionClick('AutoBilling')} primary />
                                        <DropdownItem icon={ICONS.play} label="AutoSPA" onClick={() => handleTriggerActionClick('AutoSPA')} primary />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <TriggerConfigModal
                isOpen={isConfigModalOpen}
                onClose={() => setIsConfigModalOpen(false)}
                onTrigger={handleTrigger}
                actionName={selectedAction}
            />
        </>
    );
};
