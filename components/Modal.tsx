import React from 'react';
import { Icon } from './Icon';
import { ICONS } from '../constants';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4 p-6 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-nifi-dark">{title}</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
                        <Icon path={ICONS.close} className="w-6 h-6 text-gray-500" />
                    </button>
                </div>
                <div>
                    {children}
                </div>
            </div>
        </div>
    );
};