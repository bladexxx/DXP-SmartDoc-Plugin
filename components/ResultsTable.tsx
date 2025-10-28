import React, { useState } from 'react';
import { ParsedDataItem } from '../types';
import { Icon } from './Icon';
import { ICONS } from '../constants';

interface ResultsTableProps {
    data: ParsedDataItem[];
    onUpdate: (updatedItem: ParsedDataItem) => void;
    onConfirm: (itemId: string) => void;
}

const EditableCell: React.FC<{ item: ParsedDataItem; onUpdate: (item: ParsedDataItem) => void }> = ({ item, onUpdate }) => {
    const [value, setValue] = useState(item.value);
    const [isEditing, setIsEditing] = useState(false);

    const handleBlur = () => {
        setIsEditing(false);
        if (value !== item.value) {
            onUpdate({ ...item, value });
        }
    };

    if (isEditing) {
        return (
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={handleBlur}
                autoFocus
                className="w-full px-1 py-0.5 border border-nifi-accent rounded-sm bg-white text-nifi-text"
            />
        );
    }

    return (
        <span onClick={() => setIsEditing(true)} className="cursor-pointer hover:bg-blue-100 rounded-sm px-1 py-0.5">
            {item.value}
        </span>
    );
};

export const ResultsTable: React.FC<ResultsTableProps> = ({ data, onUpdate, onConfirm }) => {
    return (
        <div className="bg-nifi-surface rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map(item => (
                        <tr key={item.id} className={item.status === 'Needs Review' ? 'bg-yellow-50' : ''}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.field}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                               <EditableCell item={item} onUpdate={onUpdate} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.confidence.toFixed(1)}%</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    item.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {item.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                {item.status === 'Needs Review' && (
                                    <button onClick={() => onConfirm(item.id)} className="text-green-600 hover:text-green-800" title="Confirm">
                                        <Icon path={ICONS.check} className="w-5 h-5" />
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};