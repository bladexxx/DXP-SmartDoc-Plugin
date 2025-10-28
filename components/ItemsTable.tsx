import React, { useState } from 'react';
import { ParsedDataField } from '../types';
import { Icon } from './Icon';
import { ICONS } from '../constants';

interface ItemsTableProps {
  items: Record<string, ParsedDataField>[];
  onUpdate: (updatedItem: ParsedDataField, rowIndex: number) => void;
  onConfirm: (itemId: string, rowIndex: number) => void;
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

export const ItemsTable: React.FC<ItemsTableProps> = ({ items, onUpdate, onConfirm }) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  if (items.length === 0) {
    return <div className="text-sm text-nifi-text-light p-4 bg-gray-50 rounded-md">No line items were parsed.</div>;
  }
  
  const headers = Object.keys(items[0]);

  const handleSave = (item: ParsedDataField, newValue: string, rowIndex: number) => {
    if (item.value !== newValue) {
        onUpdate({ ...item, value: newValue, status: 'Confirmed' }, rowIndex);
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
            {headers.map(header => (
              <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{header.replace('Items[].', '')}</th>
            ))}
            <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map(header => {
                const cellData = row[header];
                return (
                  <td key={cellData.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <EditableCell 
                        item={cellData}
                        isEditing={editingId === cellData.id}
                        onSave={(newValue) => handleSave(cellData, newValue, rowIndex)}
                    />
                  </td>
                )
              })}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {/* We can add per-cell actions here if needed in the future */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
