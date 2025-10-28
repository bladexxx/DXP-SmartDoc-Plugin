import React, { useState } from 'react';
import { ParsedDataField } from '../types';
import { Icon } from './Icon';
import { ICONS } from '../constants';

interface ResultsTableProps {
  data: ParsedDataField[];
  onUpdate: (updatedItem: ParsedDataField) => void;
  onConfirm: (itemId: string) => void;
}

const EditableCell: React.FC<{
  item: ParsedDataField;
  isEditing: boolean;
  onSave: (newValue: string) => void;
}> = ({ item, isEditing, onSave }) => {
  const [value, setValue] = useState(item.value);

  if (isEditing) {
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-nifi-accent focus:border-nifi-accent bg-white text-nifi-text"
        autoFocus
        onKeyDown={(e) => e.key === 'Enter' && onSave(value)}
        onBlur={() => onSave(value)}
      />
    );
  }
  return <>{item.value}</>;
};


export const ResultsTable: React.FC<ResultsTableProps> = ({ data, onUpdate, onConfirm }) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSave = (item: ParsedDataField, newValue: string) => {
    if (item.value !== newValue) {
        onUpdate({ ...item, value: newValue, status: 'Confirmed' });
    }
    setEditingId(null);
  };
  
  const confidenceColor = (confidence: number) => {
    if (confidence > 95) return 'text-green-600';
    if (confidence > 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">Field</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={item.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.field}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                 <EditableCell 
                    item={item}
                    isEditing={editingId === item.id}
                    onSave={(newValue) => handleSave(item, newValue)}
                 />
              </td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${confidenceColor(item.confidence)}`}>
                {item.confidence.toFixed(1)}%
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {item.status === 'Confirmed' ? (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Confirmed
                  </span>
                ) : (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Needs Review
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-4">
                    {item.status === 'Needs Review' ? (
                        <>
                        <button onClick={() => setEditingId(item.id)} className="text-nifi-accent hover:text-nifi-accent-hover">
                            <Icon path={ICONS.edit} className="w-4 h-4" />
                        </button>
                        <button onClick={() => onConfirm(item.id)} className="text-green-600 hover:text-green-800">
                            <Icon path={ICONS.check} className="w-5 h-5" />
                        </button>
                        </>
                    ) : (
                       <button onClick={() => setEditingId(item.id)} className="text-nifi-accent hover:text-nifi-accent-hover">
                           <Icon path={ICONS.edit} className="w-4 h-4" />
                       </button>
                    )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
