import React, { useState, useCallback, useEffect } from 'react';
import { Partner } from '../../types';
import { identifyPartnerFromPdf } from '../../services/geminiService';
import { Icon } from '../Icon';
import { ICONS } from '../../constants';

interface Step1_UploadPartnerProps {
    onFileUploaded?: (file: File) => void;
    uploadedFile?: File;
    onPartnerIdentified?: (partner: Partner) => void;
}

export const Step1_UploadPartner: React.FC<Step1_UploadPartnerProps> = ({ onFileUploaded, uploadedFile, onPartnerIdentified }) => {
    const [isIdentifying, setIsIdentifying] = useState(false);
    const [manualPartner, setManualPartner] = useState<Partner>({ type: 'Vendor', name: '' });
    const [needsManualInput, setNeedsManualInput] = useState(false);

    useEffect(() => {
        if (uploadedFile && onPartnerIdentified) {
            const processFile = async () => {
                setIsIdentifying(true);
                setNeedsManualInput(false);
                const partner = await identifyPartnerFromPdf(uploadedFile);
                if (partner) {
                    onPartnerIdentified(partner);
                } else {
                    setNeedsManualInput(true);
                }
                setIsIdentifying(false);
            };
            processFile();
        }
    }, [uploadedFile, onPartnerIdentified]);

    const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
            onFileUploaded?.(event.dataTransfer.files[0]);
            event.dataTransfer.clearData();
        }
    }, [onFileUploaded]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            onFileUploaded?.(event.target.files[0]);
        }
    };

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (manualPartner.name.trim()) {
            onPartnerIdentified?.(manualPartner);
        }
    };

    if (isIdentifying) {
        return (
            <div className="p-6 bg-nifi-surface rounded-lg shadow-md text-center">
                <h3 className="text-lg font-semibold text-nifi-dark mb-2">Identifying Partner...</h3>
                <p className="text-nifi-text-light">AI is analyzing <span className="font-medium">{uploadedFile?.name}</span>.</p>
                <div className="mt-4 animate-spin h-8 w-8 text-nifi-accent mx-auto">
                    <Icon path={ICONS.aiSearch} />
                </div>
            </div>
        );
    }
    
    if (needsManualInput) {
        return (
            <div className="p-6 bg-nifi-surface rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-nifi-dark mb-2">Manual Partner Identification</h3>
                <p className="text-nifi-text-light mb-4">We couldn't automatically identify the partner. Please enter the details below.</p>
                <form onSubmit={handleManualSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="partner-type" className="block text-sm font-medium text-nifi-text-light mb-1">Partner Type</label>
                        <select
                            id="partner-type"
                            value={manualPartner.type}
                            onChange={(e) => setManualPartner(p => ({ ...p, type: e.target.value as 'Vendor' | 'Customer' }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-nifi-accent focus:border-nifi-accent bg-white text-nifi-text"
                        >
                            <option>Vendor</option>
                            <option>Customer</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="partner-name" className="block text-sm font-medium text-nifi-text-light mb-1">Partner Name</label>
                        <input
                            id="partner-name"
                            type="text"
                            value={manualPartner.name}
                            onChange={(e) => setManualPartner(p => ({ ...p, name: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-nifi-accent focus:border-nifi-accent bg-white text-nifi-text"
                            placeholder="e.g., ACME Corporation"
                        />
                    </div>
                    <div className="text-right">
                        <button type="submit" className="px-4 py-2 bg-nifi-accent text-white rounded-md hover:bg-nifi-accent-hover disabled:bg-gray-400" disabled={!manualPartner.name.trim()}>
                            Confirm Partner
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div 
            className="p-6 bg-nifi-surface rounded-lg shadow-md border-2 border-dashed border-gray-300 hover:border-nifi-accent transition-colors text-center"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
        >
            <Icon path={ICONS.upload} className="w-12 h-12 mx-auto text-gray-400" />
            <h3 className="mt-2 text-lg font-semibold text-nifi-dark">Upload a PDF Document</h3>
            <p className="mt-1 text-sm text-nifi-text-light">Drag and drop a file here, or click to select a file.</p>
            <input type="file" id="file-upload" className="hidden" accept=".pdf" onChange={handleFileChange} />
            <label htmlFor="file-upload" className="mt-4 inline-block px-4 py-2 bg-nifi-accent text-white rounded-md hover:bg-nifi-accent-hover cursor-pointer">
                Select File
            </label>
        </div>
    );
};