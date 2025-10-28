import React, { useState, useMemo } from 'react';
import { Partner, Template, MappingRuleSet, MappingRule, BizModel } from '../../types';
import { Icon } from '../Icon';
import { ICONS, MOCK_BIZ_MODELS } from '../../constants';
import { Modal } from '../Modal';

interface Step3_ConfigureRulesProps {
    partner: Partner;
    template: Template;
    availableRuleSets: MappingRuleSet[];
    selectedRuleSetId: string;
    onRuleSetSelected: (ruleSetId: string) => void;
    onRuleChange: (updatedRuleSet: MappingRuleSet) => void;
    onComplete: () => void;
}

// Helper to render the schema in a readable way
const SchemaViewer: React.FC<{ schema: object }> = ({ schema }) => {
    const renderNode = (key: string, value: any, level = 0, isLast = false) => {
        const isObject = typeof value === 'object' && value !== null && !Array.isArray(value);
        const hasProperties = isObject && value.properties && Object.keys(value.properties).length > 0;
        const hasItems = isObject && value.items;

        return (
            <div key={key} className="font-mono text-sm relative">
                 <div className="absolute -left-4 h-full">
                    {Array.from({length: level}).map((_, i) => (
                         <div key={i} className="absolute border-l border-gray-300 h-full" style={{left: `${i * 16}px`}}></div>
                    ))}
                    { !isLast && <div className="absolute border-l border-gray-300 h-full" style={{left: `${level * 16}px`}}></div> }
                </div>
                <div style={{ paddingLeft: level * 16 }}>
                    <span className="text-blue-600">"{key}"</span>:
                    <span className="text-gray-500"> {value.type || 'object'}</span>
                </div>
                {hasProperties && (
                     <div className="pl-4">
                        {Object.entries(value.properties).map(([propKey, propValue], index, arr) => renderNode(propKey, propValue, level + 1, index === arr.length - 1))}
                    </div>
                )}
                {hasItems && (
                     <div className="pl-4">
                        <div style={{ paddingLeft: (level + 1) * 16 }} className="text-purple-600">[array of]</div>
                        {renderNode('items', value.items, level + 1, true)}
                    </div>
                )}
            </div>
        )
    };
    return <div className="bg-gray-50 p-4 rounded-md">{Object.entries(schema).map(([key, value]) => renderNode(key, value))}</div>;
};


// Rule Editing Modal Component
const RuleEditModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (rule: MappingRule) => void;
    rule: MappingRule | null;
    templateFields: string[];
    targetFields: string[];
}> = ({ isOpen, onClose, onSave, rule, templateFields, targetFields }) => {
    const [currentRule, setCurrentRule] = useState<MappingRule | null>(null);

    React.useEffect(() => {
        setCurrentRule(rule ? { ...rule } : null);
    }, [rule]);

    const handleSave = () => {
        if (currentRule) {
            onSave(currentRule);
        }
    };

    if (!isOpen || !currentRule) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={rule?.id && !rule.id.startsWith('new-') ? 'Edit Rule' : 'Add Rule'}>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Source Field (from Template)</label>
                    <select
                        value={currentRule.sourceField}
                        onChange={(e) => setCurrentRule({ ...currentRule, sourceField: e.target.value })}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-nifi-accent focus:border-nifi-accent sm:text-sm rounded-md bg-white text-nifi-text"
                    >
                        <option value="">Select a source field</option>
                        {templateFields.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Target Field (in Model)</label>
                     <select
                        value={currentRule.targetField}
                        onChange={(e) => setCurrentRule({ ...currentRule, targetField: e.target.value })}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-nifi-accent focus:border-nifi-accent sm:text-sm rounded-md bg-white text-nifi-text"
                    >
                        <option value="">Select a target field</option>
                        {targetFields.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                </div>
                 <div className="flex justify-end pt-4">
                    <button onClick={onClose} className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-nifi-accent border border-transparent rounded-md hover:bg-nifi-accent-hover">Save Rule</button>
                </div>
            </div>
        </Modal>
    );
};

// New Detail Viewer Panel
const DetailViewerPanel: React.FC<{
    model: BizModel;
    viewType: 'schema' | 'sample';
    onClose: () => void;
}> = ({ model, viewType, onClose }) => {
    return (
        <div className="bg-nifi-surface rounded-lg shadow-md flex flex-col h-full">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                    <button onClick={onClose} className="flex items-center text-sm text-nifi-accent hover:underline">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        Back to Rules
                    </button>
                    <h3 className="text-lg font-semibold text-nifi-dark mt-1">
                        {viewType === 'schema' ? 'Schema:' : 'Sample Data:'} <span className="text-nifi-accent">{model.name}</span>
                    </h3>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
                {viewType === 'schema' ? (
                     <SchemaViewer schema={model.schema} />
                ) : (
                    <pre className="bg-nifi-dark text-white text-sm p-4 rounded-md h-full"><code>{JSON.stringify(model.sample, null, 2)}</code></pre>
                )}
            </div>
        </div>
    );
};


export const Step3_ConfigureRules: React.FC<Step3_ConfigureRulesProps> = (props) => {
    const { partner, template, availableRuleSets, selectedRuleSetId, onRuleSetSelected, onRuleChange, onComplete } = props;

    const [isProcessing, setIsProcessing] = useState(false);
    const [detailView, setDetailView] = useState<'schema' | 'sample' | null>(null);
    
    // State for the rule editing modal
    const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
    type EditingContext = { rule: MappingRule, type: 'header' | 'item', itemSetIndex?: number };
    const [editingContext, setEditingContext] = useState<EditingContext | null>(null);

    const selectedRuleSet = useMemo(() => {
        return availableRuleSets.find(rs => rs.id === selectedRuleSetId)!;
    }, [selectedRuleSetId, availableRuleSets]);

    const targetBizModel = useMemo(() => {
        return MOCK_BIZ_MODELS.find(bm => bm.id === selectedRuleSet.bizModelId);
    }, [selectedRuleSet]);
    
    // --- Modal Logic ---
    const openRuleModal = (rule: MappingRule | null, type: 'header' | 'item', itemSetIndex?: number) => {
        setEditingContext({ 
            rule: rule || { id: `new-${Date.now()}`, sourceField: '', targetField: ''},
            type, 
            itemSetIndex 
        });
        setIsRuleModalOpen(true);
    };

    const handleSaveRule = (updatedRule: MappingRule) => {
        if (!editingContext) return;

        const newRuleSet = JSON.parse(JSON.stringify(selectedRuleSet)); // Deep copy

        if (editingContext.type === 'header') {
            const ruleIndex = newRuleSet.headerRules.findIndex(r => r.id === updatedRule.id);
            if (ruleIndex > -1) newRuleSet.headerRules[ruleIndex] = updatedRule;
            else newRuleSet.headerRules.push(updatedRule);
        } else if (editingContext.type === 'item' && editingContext.itemSetIndex !== undefined) {
             const itemSet = newRuleSet.itemRules[editingContext.itemSetIndex];
             const ruleIndex = itemSet.rules.findIndex(r => r.id === updatedRule.id);
             if (ruleIndex > -1) itemSet.rules[ruleIndex] = updatedRule;
             else itemSet.rules.push(updatedRule);
        }
        
        onRuleChange(newRuleSet);
        setIsRuleModalOpen(false);
        setEditingContext(null);
    };
    
    const handleDeleteRule = (ruleId: string, type: 'header' | 'item', itemSetIndex?: number) => {
        const newRuleSet = JSON.parse(JSON.stringify(selectedRuleSet));
        if (type === 'header') {
            newRuleSet.headerRules = newRuleSet.headerRules.filter(r => r.id !== ruleId);
        } else if (type === 'item' && itemSetIndex !== undefined) {
            newRuleSet.itemRules[itemSetIndex].rules = newRuleSet.itemRules[itemSetIndex].rules.filter(r => r.id !== ruleId);
        }
        onRuleChange(newRuleSet);
    };
    
    // --- Field Extraction for Modal Dropdowns ---
    const { headerTargetFields, itemTargetFields } = useMemo(() => {
        const headerFields: string[] = [];
        const itemFields: Record<string, string[]> = {};

        const schema = targetBizModel?.schema as any;
        if (!schema) return { headerTargetFields: [], itemTargetFields: {} };

        const rootProperties = schema.items?.properties;
        if (!rootProperties) return { headerTargetFields: [], itemTargetFields: {} };

        Object.keys(rootProperties).forEach(key => {
            if (rootProperties[key].type === 'object') {
                Object.keys(rootProperties[key].properties).forEach(subKey => {
                    headerFields.push(`${key}.${subKey}`);
                });
            } else if (rootProperties[key].type === 'array') {
                const arrayName = key;
                itemFields[arrayName] = [];
                const itemProps = rootProperties[key].items?.properties;
                if (itemProps) {
                    Object.keys(itemProps).forEach(itemKey => {
                        itemFields[arrayName].push(`${arrayName}[].${itemKey}`);
                    });
                }
            }
        });

        return { headerTargetFields: headerFields, itemTargetFields: itemFields };
    }, [targetBizModel]);


    const handleComplete = () => {
        setIsProcessing(true);
        onComplete();
    };

    if (isProcessing) { /* ... processing spinner ... */ }

    const RulesTable: React.FC<{
        rules: MappingRule[];
        onEdit: (rule: MappingRule) => void;
        onDelete: (ruleId: string) => void;
    }> = ({ rules, onEdit, onDelete }) => (
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source Field (Template)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target Field (Model)</th>
                    <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {rules.map(rule => (
                    <tr key={rule.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{rule.sourceField}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-mono">{rule.targetField}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button onClick={() => onEdit(rule)} className="text-nifi-accent hover:text-nifi-accent-hover mr-3"><Icon path={ICONS.edit} className="w-4 h-4"/></button>
                            <button onClick={() => onDelete(rule.id)} className="text-red-600 hover:text-red-800"><Icon path={ICONS.delete} className="w-4 h-4"/></button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    if (detailView && targetBizModel) {
        return <DetailViewerPanel model={targetBizModel} viewType={detailView} onClose={() => setDetailView(null)} />;
    }

    return (
        <>
            <div className="p-6 bg-nifi-surface rounded-lg shadow-md">
                {/* Header and Rule Set Selection */}
                <h3 className="text-lg font-semibold text-nifi-dark mb-1">Configure Mapping Rules</h3>
                <p className="text-sm text-nifi-text-light mb-4">For partner <span className="font-semibold text-nifi-accent">{partner.name}</span> using template <span className="font-semibold text-nifi-accent">{template.name}</span>.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 border rounded-md">
                    <div>
                        <label htmlFor="ruleset-select" className="block text-sm font-medium text-nifi-text-light mb-1">Mapping Rule Set</label>
                        <select id="ruleset-select" value={selectedRuleSetId} onChange={(e) => onRuleSetSelected(e.target.value)} className="w-full px-3 py-2 bg-white text-nifi-text border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-nifi-accent focus:border-nifi-accent">
                            {availableRuleSets.map(rs => <option key={rs.id} value={rs.id}>{rs.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-nifi-text-light mb-1">Target Model</label>
                        <div className="flex items-center justify-between px-3 py-2 bg-gray-50 text-nifi-text border border-gray-300 rounded-md">
                           <span>{targetBizModel?.name}</span>
                           <div className="flex items-center space-x-2">
                               <button onClick={() => setDetailView('schema')} title="View Model Schema" className="text-gray-400 hover:text-nifi-accent"><Icon path={ICONS.eye} className="w-5 h-5" /></button>
                               <button onClick={() => setDetailView('sample')} title="Show Sample Data" className="text-gray-400 hover:text-nifi-accent"><Icon path={ICONS.code} className="w-5 h-5" /></button>
                           </div>
                        </div>
                    </div>
                </div>

                {/* Header Rules */}
                <div className="mt-8">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-nifi-text">Header Mappings</h4>
                        <button onClick={() => openRuleModal(null, 'header')} className="flex items-center px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                            <Icon path={ICONS.add} className="w-4 h-4 mr-2" /> Add Header Rule
                        </button>
                    </div>
                    <div className="bg-white rounded-lg shadow-md overflow-hidden border">
                       <RulesTable rules={selectedRuleSet.headerRules} onEdit={(rule) => openRuleModal(rule, 'header')} onDelete={(ruleId) => handleDeleteRule(ruleId, 'header')} />
                    </div>
                </div>

                {/* Item Rules */}
                {selectedRuleSet.itemRules.map((itemSet, index) => (
                    <div className="mt-8" key={itemSet.targetArray}>
                         <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold text-nifi-text">Line Item Mappings for <span className="font-mono bg-gray-100 p-1 rounded text-sm">{itemSet.targetArray}</span></h4>
                            <button onClick={() => openRuleModal(null, 'item', index)} className="flex items-center px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                                <Icon path={ICONS.add} className="w-4 h-4 mr-2" /> Add Item Rule
                            </button>
                        </div>
                        <div className="bg-white rounded-lg shadow-md overflow-hidden border">
                           <RulesTable rules={itemSet.rules} onEdit={(rule) => openRuleModal(rule, 'item', index)} onDelete={(ruleId) => handleDeleteRule(ruleId, 'item', index)} />
                        </div>
                    </div>
                ))}

                <div className="mt-8 text-right">
                    <button onClick={handleComplete} className="px-6 py-2 bg-nifi-accent text-white rounded-md hover:bg-nifi-accent-hover">Run Parser</button>
                </div>
            </div>

            {editingContext && (
                <RuleEditModal
                    isOpen={isRuleModalOpen}
                    onClose={() => setIsRuleModalOpen(false)}
                    onSave={handleSaveRule}
                    rule={editingContext.rule}
                    templateFields={template.fields}
                    targetFields={editingContext.type === 'header' ? headerTargetFields : itemTargetFields[selectedRuleSet.itemRules[editingContext.itemSetIndex!].targetArray] || []}
                />
            )}
        </>
    );
};