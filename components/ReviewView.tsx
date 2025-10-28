import React, { useState, useEffect } from 'react';
import { ParsedOutput, ParsedDataField } from '../types';
import { ResultsTable } from './ResultsTable';
import { ActionsPanel } from './ActionsPanel';
import { Icon } from './Icon';
import { ICONS } from '../constants';
import { ItemsTable } from './ItemsTable';

interface ReviewViewProps {
  parsedData: ParsedOutput | null;
  onHeaderUpdate: (updatedItem: ParsedDataField) => void;
  onHeaderConfirm: (itemId: string) => void;
  onItemUpdate: (updatedItem: ParsedDataField, rowIndex: number) => void;
  onItemConfirm: (itemId: string, rowIndex: number) => void;
  uploadedFile: File | undefined;
}

export const ReviewView: React.FC<ReviewViewProps> = (props) => {
  const { 
    parsedData, 
    onHeaderUpdate,
    onHeaderConfirm,
    onItemUpdate,
    onItemConfirm,
    uploadedFile 
  } = props;
  
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    if (uploadedFile) {
      const url = URL.createObjectURL(uploadedFile);
      setPdfUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [uploadedFile]);

  return (
    <div className="flex h-full gap-8">
        {/* Left Panel: PDF Viewer */}
        <div className="w-1/2 h-full">
            <div className="bg-white rounded-lg h-full flex flex-col items-center justify-center text-center p-1 border-2 border-dashed border-gray-300">
                {uploadedFile && pdfUrl ? (
                    <iframe src={pdfUrl} title={uploadedFile.name} className="w-full h-full border-0" />
                ) : (
                    <>
                        <Icon path={ICONS.document} className="w-24 h-24 text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold text-nifi-dark">Original Document</h3>
                        <p className="text-sm text-nifi-text-light mt-1">No document uploaded.</p>
                    </>
                )}
            </div>
        </div>

        {/* Right Panel: Results & Actions */}
        <div className="w-1/2 flex flex-col h-full">
            <h2 className="text-2xl font-bold text-nifi-dark mb-6 flex-shrink-0">Output Review & Actions</h2>
            <div className="flex-grow overflow-hidden relative">
                <div className="absolute inset-0 overflow-y-auto pr-2 space-y-8">
                    {parsedData ? (
                        <>
                            <div>
                                <h3 className="text-lg font-semibold text-nifi-dark mb-3">Header Details</h3>
                                <ResultsTable data={parsedData.headerData} onUpdate={onHeaderUpdate} onConfirm={onHeaderConfirm} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-nifi-dark mb-3">Line Items</h3>
                                <ItemsTable 
                                    items={parsedData.items} 
                                    onUpdate={onItemUpdate} 
                                    onConfirm={onItemConfirm} 
                                />
                            </div>
                        </>
                    ) : (
                        <p className="text-nifi-text-light">No data has been parsed yet.</p>
                    )}
                </div>
            </div>
            <div className="flex-shrink-0">
                 <ActionsPanel />
            </div>
        </div>
    </div>
  );
};
