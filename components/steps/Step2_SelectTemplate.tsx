import React, { useState, useEffect } from 'react';
import { Template, Partner } from '../../types';
import { suggestTemplateForPartner } from '../../services/geminiService';
import { Icon } from '../Icon';
import { ICONS } from '../../constants';

interface Step2_SelectTemplateProps {
  partner: Partner;
  templates: Template[];
  onTemplateSelected: (templateId: string) => void;
}

export const Step2_SelectTemplate: React.FC<Step2_SelectTemplateProps> = ({ partner, templates, onTemplateSelected }) => {
    const [selectedId, setSelectedId] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [noTemplateFound, setNoTemplateFound] = useState(false);
    
    useEffect(() => {
        const getSuggestion = async () => {
            setIsLoading(true);
            const suggestedId = await suggestTemplateForPartner(partner, templates);
            if (suggestedId) {
                setSelectedId(suggestedId);
            } else if (templates.length > 0) {
                 // Fallback if no specific suggestion
                setSelectedId(templates[0].id);
            } else {
                setNoTemplateFound(true);
            }
            setIsLoading(false);
        };
        getSuggestion();
    }, [partner, templates]);

    if (isLoading) {
        return (
            <div className="p-6 bg-nifi-surface rounded-lg shadow-md text-center">
                <h3 className="text-lg font-semibold text-nifi-dark mb-2">Finding best template...</h3>
                <p className="text-nifi-text-light">AI is searching for a template for <span className="font-medium">{partner.name}</span>.</p>
                 <div className="mt-4 animate-spin h-8 w-8 text-nifi-accent mx-auto">
                    <Icon path={ICONS.aiSearch} />
                </div>
            </div>
        );
    }
    
    if (noTemplateFound) {
        return (
            <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg shadow-md text-center">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">No Suitable Template Found</h3>
                <p className="text-yellow-700 mb-4">There are no templates configured for <span className="font-medium">{partner.name}</span>.</p>
                <button 
                    onClick={() => alert('Redirecting to external DXP Template Creator...')} 
                    className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                >
                    Create New Template in DXP
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 bg-nifi-surface rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-nifi-dark mb-4">Select Template for <span className="text-nifi-accent">{partner.name}</span></h3>
            <div className="space-y-4">
                <div>
                    <label htmlFor="template-select" className="block text-sm font-medium text-nifi-text-light mb-1">Suggested Template</label>
                    <select
                        id="template-select"
                        value={selectedId}
                        onChange={(e) => setSelectedId(e.target.value)}
                        className="w-full px-3 py-2 bg-white text-nifi-text border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-nifi-accent focus:border-nifi-accent"
                    >
                        {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                </div>
                <div className="text-right">
                    <button 
                        onClick={() => onTemplateSelected(selectedId)}
                        disabled={!selectedId}
                        className="px-4 py-2 bg-nifi-accent text-white rounded-md hover:bg-nifi-accent-hover disabled:bg-gray-400"
                    >
                        Next: Configure Rules
                    </button>
                </div>
            </div>
        </div>
    );
};