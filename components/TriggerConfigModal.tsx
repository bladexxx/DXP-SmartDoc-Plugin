import React, { useState } from 'react';
import { Modal } from './Modal';
import { TriggerConfig } from '../types';

interface TriggerConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
    onTrigger: (config: TriggerConfig) => void;
    actionName: string;
}

export const TriggerConfigModal: React.FC<TriggerConfigModalProps> = ({ isOpen, onClose, onTrigger, actionName }) => {
    const [config, setConfig] = useState<Omit<TriggerConfig, 'actionName'>>({
        environment: 'DEV',
        exchangeName: '',
        routingKey: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setConfig(prev => ({ ...prev, [name]: value as 'UAT' | 'DEV' }));
    };

    const handleSubmit = () => {
        if (config.exchangeName.trim() && config.routingKey.trim()) {
            onTrigger({ ...config, actionName });
        } else {
            alert('Please fill in all fields.');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Trigger Action: ${actionName}`}>
            <div className="space-y-4">
                <div>
                    <label htmlFor="environment" className="block text-sm font-medium text-gray-700">Environment</label>
                    <select
                        id="environment"
                        name="environment"
                        value={config.environment}
                        onChange={handleChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-nifi-accent focus:border-nifi-accent sm:text-sm rounded-md bg-white text-nifi-text"
                    >
                        <option>DEV</option>
                        <option>UAT</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="exchangeName" className="block text-sm font-medium text-gray-700">Target Exchange Name</label>
                    <input
                        type="text"
                        id="exchangeName"
                        name="exchangeName"
                        value={config.exchangeName}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-nifi-accent focus:border-nifi-accent bg-white text-nifi-text"
                        placeholder="e.g., dxp.events"
                    />
                </div>
                <div>
                    <label htmlFor="routingKey" className="block text-sm font-medium text-gray-700">Routing Key</label>
                    <input
                        type="text"
                        id="routingKey"
                        name="routingKey"
                        value={config.routingKey}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-nifi-accent focus:border-nifi-accent bg-white text-nifi-text"
                        placeholder="e.g., invoice.parsed.autobill"
                    />
                </div>
            </div>
            <div className="flex justify-end pt-6">
                <button onClick={onClose} className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
                <button onClick={handleSubmit} className="px-4 py-2 text-sm font-medium text-white bg-nifi-accent border border-transparent rounded-md hover:bg-nifi-accent-hover">Trigger</button>
            </div>
        </Modal>
    );
};
