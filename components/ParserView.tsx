import React, { useState } from 'react';
import { Stepper } from './Stepper';
import { WizardStep, Partner, Template, ParsedOutput, MappingRuleSet } from '../types';
import { Step1_UploadPartner } from './steps/Step1_UploadPartner';
import { Step2_SelectTemplate } from './steps/Step2_SelectTemplate';
import { Step3_ConfigureRules } from './steps/Step3_ConfigureRules';
import { generateMockParsedData } from '../constants';

interface ParserViewProps {
  onParsingComplete: (data: ParsedOutput) => void;
  templates: Template[];
  onTemplateSelected: (templateId: string) => void;
  availableRuleSets: MappingRuleSet[];
  selectedRuleSetId?: string;
  onRuleSetSelected: (ruleSetId: string) => void;
  onRuleChange: (updatedRuleSet: MappingRuleSet) => void;
  uploadedFile: File | undefined;
  onFileUploaded: (file: File) => void;
}

export const ParserView: React.FC<ParserViewProps> = (props) => {
  const { 
    onParsingComplete, 
    templates, 
    onTemplateSelected, 
    availableRuleSets,
    selectedRuleSetId,
    onRuleSetSelected,
    onRuleChange,
    uploadedFile,
    onFileUploaded,
  } = props;
  
  const [currentStep, setCurrentStep] = useState<WizardStep>(WizardStep.Upload);
  const [identifiedPartner, setIdentifiedPartner] = useState<Partner | undefined>();

  const handleFileUploadedInternal = (file: File) => {
    onFileUploaded(file);
    setCurrentStep(WizardStep.IdentifyPartner);
  };

  const handlePartnerIdentified = (partner: Partner) => {
    setIdentifiedPartner(partner);
    setCurrentStep(WizardStep.SelectTemplate);
  };

  const handleTemplateSelectedInternal = (templateId: string) => {
    onTemplateSelected(templateId);
    setCurrentStep(WizardStep.ConfigureRules);
  };

  const handleRulesConfigured = () => {
    const selectedRuleSet = availableRuleSets.find(rs => rs.id === selectedRuleSetId);
    if (!selectedRuleSet || !identifiedPartner) return;
    
    console.log("Parsing with:", {
      file: uploadedFile?.name,
      partner: identifiedPartner?.name,
      ruleSet: selectedRuleSet.name,
    });
    
    setTimeout(() => {
      const mockData = generateMockParsedData(identifiedPartner, selectedRuleSet);
      onParsingComplete(mockData);
    }, 1500);
  };

  const getSelectedTemplate = () => {
    if (!selectedRuleSetId) return undefined;
    return templates.find(t => t.compatibleRuleSetIds.includes(selectedRuleSetId));
  };
  
  const partnerTemplates = React.useMemo(() => {
    if (!identifiedPartner) return [];
    return templates.filter(t => !t.partnerName || t.partnerName === identifiedPartner.name);
  }, [identifiedPartner, templates]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12">
        <Stepper currentStep={currentStep} />
      </div>

      <div className="mt-8">
        {currentStep === WizardStep.Upload && (
          <Step1_UploadPartner onFileUploaded={handleFileUploadedInternal} />
        )}
        {currentStep === WizardStep.IdentifyPartner && (
          <Step1_UploadPartner 
            uploadedFile={uploadedFile}
            onPartnerIdentified={handlePartnerIdentified}
          />
        )}
        {currentStep === WizardStep.SelectTemplate && identifiedPartner && (
          <Step2_SelectTemplate 
            partner={identifiedPartner}
            templates={partnerTemplates}
            onTemplateSelected={handleTemplateSelectedInternal}
          />
        )}
        {currentStep === WizardStep.ConfigureRules && identifiedPartner && getSelectedTemplate() && selectedRuleSetId && (
          <Step3_ConfigureRules
            partner={identifiedPartner}
            template={getSelectedTemplate()!}
            availableRuleSets={availableRuleSets}
            selectedRuleSetId={selectedRuleSetId}
            onRuleSetSelected={onRuleSetSelected}
            onRuleChange={onRuleChange}
            onComplete={handleRulesConfigured}
          />
        )}
      </div>
    </div>
  );
};
