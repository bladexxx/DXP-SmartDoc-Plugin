import React, { useState, useMemo } from 'react';
import { TabNav } from './components/TabNav';
import { Header } from './components/Header';
import { ParserView } from './components/ParserView';
import { ReviewView } from './components/ReviewView';
import { View, ParsedOutput, Template, MappingRuleSet, ParsedDataField } from './types';
import { MOCK_RULE_SETS, MOCK_TEMPLATES } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.Parser);
  const [parsedData, setParsedData] = useState<ParsedOutput | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | undefined>();
  
  const [templates, setTemplates] = useState<Template[]>(MOCK_TEMPLATES);
  const [ruleSets, setRuleSets] = useState<MappingRuleSet[]>(MOCK_RULE_SETS);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>();
  const [selectedRuleSetId, setSelectedRuleSetId] = useState<string | undefined>();

  const availableRuleSets = useMemo(() => {
    if (!selectedTemplateId) return [];
    const template = templates.find(t => t.id === selectedTemplateId);
    if (!template) return [];
    return ruleSets.filter(rs => template.compatibleRuleSetIds.includes(rs.id));
  }, [selectedTemplateId, ruleSets, templates]);

  const handleTemplateSelected = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const template = templates.find(t => t.id === templateId);
    const firstCompatibleRuleSetId = template?.compatibleRuleSetIds[0];
    setSelectedRuleSetId(firstCompatibleRuleSetId);
  };

  const handleParsingComplete = (data: ParsedOutput) => {
    setParsedData(data);
    setCurrentView(View.Review);
  };

  const handleResetWizard = () => {
    setParsedData(null);
    setSelectedTemplateId(undefined);
    setSelectedRuleSetId(undefined);
    setUploadedFile(undefined);
    setCurrentView(View.Parser);
  };
  
  const handleHeaderUpdate = (updatedItem: ParsedDataField) => {
    setParsedData(currentData => {
      if (!currentData) return null;
      return {
        ...currentData,
        headerData: currentData.headerData.map(item => item.id === updatedItem.id ? updatedItem : item)
      };
    });
  };

  const handleHeaderConfirm = (itemId: string) => {
    setParsedData(currentData => {
      if (!currentData) return null;
      return {
        ...currentData,
        headerData: currentData.headerData.map(item => item.id === itemId ? { ...item, status: 'Confirmed' } : item)
      };
    });
  };
  
  const handleItemUpdate = (updatedItem: ParsedDataField, rowIndex: number) => {
    setParsedData(currentData => {
        if (!currentData) return null;
        const newItems = [...currentData.items];
        const newRow = { ...newItems[rowIndex] };
        
        // Find the specific cell (field) in the row to update
        const fieldKey = Object.keys(newRow).find(key => newRow[key].id === updatedItem.id);
        if (fieldKey) {
            newRow[fieldKey] = updatedItem;
        }

        newItems[rowIndex] = newRow;

        return { ...currentData, items: newItems };
    });
  };

  const handleItemConfirm = (itemId: string, rowIndex: number) => {
    setParsedData(currentData => {
      if (!currentData) return null;
      const newItems = [...currentData.items];
      const newRow = { ...newItems[rowIndex] };
      
      const fieldKey = Object.keys(newRow).find(key => newRow[key].id === itemId);
      if (fieldKey) {
        newRow[fieldKey] = { ...newRow[fieldKey], status: 'Confirmed' };
      }

      newItems[rowIndex] = newRow;

      return { ...currentData, items: newItems };
    });
  };

  const handleRuleChange = (updatedRuleSet: MappingRuleSet) => {
     setRuleSets(currentRuleSets => 
      currentRuleSets.map(rs => rs.id === updatedRuleSet.id ? updatedRuleSet : rs)
    );
  }

  return (
    <div className="h-screen bg-nifi-bg font-sans flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col overflow-hidden bg-nifi-surface">
        <div className="px-8 border-b border-gray-200">
          <TabNav 
            currentView={currentView}
            setCurrentView={setCurrentView}
            onResetWizard={handleResetWizard}
          />
        </div>
        <div className="flex-1 overflow-y-auto p-8">
          {currentView === View.Parser ? (
            <ParserView 
              onParsingComplete={handleParsingComplete}
              templates={templates}
              onTemplateSelected={handleTemplateSelected}
              availableRuleSets={availableRuleSets}
              selectedRuleSetId={selectedRuleSetId}
              onRuleSetSelected={setSelectedRuleSetId}
              onRuleChange={handleRuleChange}
              uploadedFile={uploadedFile}
              onFileUploaded={setUploadedFile}
            />
          ) : (
            <ReviewView 
              parsedData={parsedData} 
              onHeaderUpdate={handleHeaderUpdate}
              onHeaderConfirm={handleHeaderConfirm}
              onItemUpdate={handleItemUpdate}
              onItemConfirm={handleItemConfirm}
              uploadedFile={uploadedFile}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
