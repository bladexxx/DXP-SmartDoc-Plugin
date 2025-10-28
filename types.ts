
// Fix: Replaced incorrect component code with actual type definitions.
export enum View {
    Parser = 'Parser',
    Review = 'Review',
}

export enum WizardStep {
    Upload = 'Upload',
    IdentifyPartner = 'IdentifyPartner',
    SelectTemplate = 'SelectTemplate',
    ConfigureRules = 'ConfigureRules',
}

export interface Partner {
    name: string;
    type: 'Vendor' | 'Customer';
}

export interface Template {
    id: string;
    name: string;
    fields: string[];
    compatibleRuleSetIds: string[];
    partnerName?: string;
}

export interface ParsedDataItem {
    id: string;
    field: string;
    value: string;
    confidence: number;
    status: 'Confirmed' | 'Needs Review';
}

export interface MappingRule {
    id: string;
    sourceField: string;
    targetField: string;
}

export interface ItemRuleSet {
  targetArray: string;
  rules: MappingRule[];
}

export interface MappingRuleSet {
    id: string;
    name: string;
    bizModelId: string;
    headerRules: MappingRule[];
    itemRules: ItemRuleSet[];
}

export interface BizModel {
    id: string;
    name: string;
    description: string;
    schema: object;
    sample: any[];
}
