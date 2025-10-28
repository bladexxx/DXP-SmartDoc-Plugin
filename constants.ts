import { Partner, Template, ParsedOutput, BizModel, MappingRuleSet, ParsedDataField } from './types';

// SVG paths for icons
export const ICONS = {
    parser: 'M3 3h18v18H3V3zm16 16V5H5v14h14zM7 7h10v2H7V7zm0 4h10v2H7v-2zm0 4h10v2H7v-2z',
    review: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z',
    help: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z',
    settings: 'M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12-.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49.42l.38-2.65c.61-.25 1.17-.59-1.69.98l2.49 1c.23.09.49 0 .61.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z',
    close: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z',
    document: 'M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z',
    rules: 'M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z',
    check: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
    upload: 'M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z',
    aiSearch: 'M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z',
    csv: 'M5 14h3v-2H5v2zm0-4h3V8H5v2zm0-4h3V4H5v2zm4 8h10V4H9v12z',
    excel: 'M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z',
    email: 'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
    play: 'M8 5v14l11-7z',
    add: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
    edit: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z',
    delete: 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z',
    eye: 'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5C21.27 7.61 17 4.5 12 4.5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm-3-5c0-1.66 1.34-3 3-3s3 1.34 3 3-1.34 3-3 3-3-1.34-3-3z',
    code: 'M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z',
    chevronDown: 'M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z',
    link: 'M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z',
};

// --- BIZ MODELS ---
const INVOICE_SAMPLE_DATA = [{"Invoice":{"TrackingNo":null,"Remit":{"Name":"Bank of America - Acct 3756323876","Address":["1950 N. Stemmons Fwy Ste 5010"],"City":"Dallas","State":"TX","Country":"US","Zip":"752849730"},"TotalInvoiceAmount":"422592","Terms":{"TermsNetDay":null,"TermsDescription":"Up to 12/31/2022 without deduction","TermsNetDueDate":null,"TermsDiscountAmount":"0","TermsDiscountPercent":null,"TermsDiscountDueDate":"30"},"ShipTo":{"Name":"Synnex CorporationAttn: Sunny Tang","Address":["44201 Nobel Drive"],"City":"FREMONT","State":"CA","Country":"US","Zip":"94538"},"Carrier":null,"PONo":"31318358","TransactionPurpose":null,"VendorOrderNo":"9881649894","InvoiceDate":"20221201","BillTo":{"Name":"Synnex Corporation","Address":["44201 Nobel Drive"],"City":"FREMONT","State":"CA","Country":"US","Zip":"94538"},"FreightCharge":null,"PODate":"20221201","CurrencyType":"USD","BillFrom":null,"TaxSummary":null,"InvoiceNo":"9881649894","InvoiceType":"Right to Use"},"Items":[{"UnitPrice":"37.32","ServiceStartDate":null,"BuyerPartNo":null,"ServiceEndDate":null,"ManufacturerPartNo":"9EA-00314","VendorPartNo":null,"SerialNo":null,"InvoiceQuantity":"16","LineItemIdentification":"10","Tax":null,"ContractNo":null},{"UnitPrice":"17.16","ServiceStartDate":null,"BuyerPartNo":null,"ServiceEndDate":null,"ManufacturerPartNo":"KW5-00359","VendorPartNo":null,"SerialNo":null,"InvoiceQuantity":"126","LineItemIdentification":"20","Tax":null,"ContractNo":null},{"UnitPrice":"11.64","ServiceStartDate":null,"BuyerPartNo":null,"ServiceEndDate":null,"ManufacturerPartNo":"W06-01838","VendorPartNo":null,"SerialNo":null,"InvoiceQuantity":"126","LineItemIdentification":"30","Tax":null,"ContractNo":null}]}];

const INVOICE_SCHEMA = {
  "type": "array", "items": { "type": "object", "properties": {
    "Invoice": { "type": "object", "properties": {
      "InvoiceNo": { "type": "string" }, "InvoiceDate": { "type": "string" }, "TotalInvoiceAmount": { "type": "string" }, "CurrencyType": { "type": "string" }, "PONo": { "type": "string" },
      "BillTo": { "type": "object", "properties": { "Name": { "type": "string" }, "Address": { "type": "array", "items": { "type": "string" } }, "City": { "type": "string" }, "State": { "type": "string" }, "Zip": { "type": "string" }, "Country": { "type": "string" } } },
      "ShipTo": { "type": "object", "properties": { "Name": { "type": "string" }, "Address": { "type": "array", "items": { "type": "string" } }, "City": { "type": "string" }, "State": { "type": "string" }, "Zip": { "type": "string" }, "Country": { "type": "string" } } },
      "Remit": { "type": "object", "properties": { "Name": { "type": "string" }, "Address": { "type": "array", "items": { "type": "string" } }, "City": { "type": "string" }, "State": { "type": "string" }, "Zip": { "type": "string" }, "Country": { "type": "string" } } },
      "Terms": { "type": "object", "properties": { "TermsDescription": { "type": "string" } } }
    }},
    "Items": { "type": "array", "items": { "type": "object", "properties": {
      "LineItemIdentification": { "type": "string" }, "InvoiceQuantity": { "type": "string" }, "UnitPrice": { "type": "string" }, "ManufacturerPartNo": { "type": "string" }
    }}}
}}};

export const MOCK_BIZ_MODELS: BizModel[] = [
    { id: 'bm-invoice-std', name: 'Invoice Standard Model', description: 'Standard schema for B2B invoice transactions.', schema: INVOICE_SCHEMA, sample: INVOICE_SAMPLE_DATA },
    // Add other models like Quote, ASN here
];

// --- MAPPING RULE SETS ---
export const MOCK_RULE_SETS: MappingRuleSet[] = [
    {
        id: 'rs-1',
        name: 'Default Invoice Mapping',
        bizModelId: 'bm-invoice-std',
        headerRules: [
            { id: 'rh-1', sourceField: 'Invoice Number', targetField: 'Invoice.InvoiceNo' },
            { id: 'rh-2', sourceField: 'Invoice Date', targetField: 'Invoice.InvoiceDate' },
            { id: 'rh-3', sourceField: 'Due Date', targetField: 'Invoice.Terms.TermsDescription' },
            { id: 'rh-4', sourceField: 'Total Amount', targetField: 'Invoice.TotalInvoiceAmount' },
            { id: 'rh-5', sourceField: 'Vendor Name', targetField: 'Invoice.BillTo.Name' },
        ],
        itemRules: [
            {
                targetArray: 'Items',
                rules: [
                    { id: 'ri-1', sourceField: 'Item Description', targetField: 'Items[].ManufacturerPartNo' },
                    { id: 'ri-2', sourceField: 'Quantity', targetField: 'Items[].InvoiceQuantity' },
                    { id: 'ri-3', sourceField: 'Unit Price', targetField: 'Items[].UnitPrice' },
                ]
            }
        ]
    }
];

// --- PARTNERS & TEMPLATES ---
export const MOCK_PARTNERS: Partner[] = [
  { name: 'ACME Corporation', type: 'Vendor' },
  { name: 'Globex Inc.', type: 'Vendor' },
  { name: 'Stark Industries', type: 'Customer' },
  { name: 'Wayne Enterprises', type: 'Customer' },
];

export const MOCK_TEMPLATES: Template[] = [
  { id: 't-1', name: 'Standard Invoice', fields: ['Invoice Number', 'Invoice Date', 'Due Date', 'Total Amount', 'Vendor Name', 'Item Description', 'Quantity', 'Unit Price'], compatibleRuleSetIds: ['rs-1'] },
  { id: 't-2', name: 'Purchase Order', fields: ['PO Number', 'Order Date', 'Shipping Address', 'Item Description', 'Quantity', 'Unit Price'], compatibleRuleSetIds: [] },
  { id: 't-3', name: 'ACME Bill of Lading', fields: ['BOL Number', 'Shipper Name', 'Consignee Name', 'Freight Charges'], partnerName: 'ACME Corporation', compatibleRuleSetIds: [] },
  { id: 't-4', name: 'Globex Service Report', fields: ['Report ID', 'Service Date', 'Technician', 'Hours Worked'], partnerName: 'Globex Inc.', compatibleRuleSetIds: [] },
];

// --- DYNAMIC PARSED DATA ---
const generateRandomValue = (field: string, partnerName: string): string => {
    if (field.toLowerCase().includes('number') || field.toLowerCase().includes('id')) return `DOC-${Math.floor(1000 + Math.random() * 9000)}`;
    if (field.toLowerCase().includes('date')) {
        const d = new Date(Date.now() - Math.random() * 1e10);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }
    if (field.toLowerCase().includes('amount') || field.toLowerCase().includes('charges') || field.toLowerCase().includes('price')) return `$${(Math.random() * 2000 + 50).toFixed(2)}`;
    if (field.toLowerCase().includes('name')) return partnerName;
    if (field.toLowerCase().includes('quantity')) return `${Math.floor(1 + Math.random() * 20)}`;
    return `Sample value for ${field}`;
};

export const generateMockParsedData = (partner: Partner, ruleSet: MappingRuleSet): ParsedOutput => {
    const headerData: ParsedDataField[] = ruleSet.headerRules.map((rule, index) => {
        const confidence = 80 + Math.random() * 20;
        return {
            id: `pdh-${index + 1}`,
            field: rule.targetField,
            value: generateRandomValue(rule.sourceField, partner.name),
            confidence,
            status: confidence > 95 ? 'Confirmed' : 'Needs Review',
        };
    });

    const items: Record<string, ParsedDataField>[] = [];
    const itemCount = Math.floor(Math.random() * 4) + 2; // 2 to 5 items

    if (ruleSet.itemRules.length > 0) {
        const itemRuleSet = ruleSet.itemRules[0]; // Assuming one item list for simplicity
        for (let i = 0; i < itemCount; i++) {
            const row: Record<string, ParsedDataField> = {};
            itemRuleSet.rules.forEach((rule, j) => {
                const confidence = 80 + Math.random() * 20;
                row[rule.targetField] = {
                    id: `pdi-${i}-${j}`,
                    field: rule.targetField,
                    value: generateRandomValue(rule.sourceField, partner.name),
                    confidence,
                    status: confidence > 95 ? 'Confirmed' : 'Needs Review',
                };
            });
            items.push(row);
        }
    }

    return { headerData, items };
};
