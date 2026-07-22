import React from 'react';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import FormTextArea from './FormTextArea';
import { ComplaintFormData } from '../types';

interface ComplaintDetailsSectionProps {
  data: ComplaintFormData;
  onUpdate: (field: keyof ComplaintFormData, value: string) => void;
  errors?: Record<string, string>;
}

const COMPLAINT_TYPES = [
  { value: 'Adverse Effect', label: 'Adverse Effect (Patient Impact)' },
  { value: 'Defective Product', label: 'Defective Product (Quality Issue)' },
  { value: 'Wrong Strength', label: 'Wrong Strength/Dose' },
  { value: 'Packaging Issue', label: 'Packaging Issue' },
  { value: 'Labeling Issue', label: 'Labeling Issue' },
  { value: 'Expired Product', label: 'Expired Product' },
  { value: 'Contamination', label: 'Contamination' },
  { value: 'Efficacy Issue', label: 'Efficacy Issue' },
  { value: 'Storage Issue', label: 'Storage/Handling Issue' },
  { value: 'Other', label: 'Other' },
];

export const ComplaintDetailsSection: React.FC<ComplaintDetailsSectionProps> = ({
  data,
  onUpdate,
  errors = {},
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
          <span className="w-5 h-5 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold mr-2">
            3
          </span>
          Complaint Details
        </h3>
      </div>

      <FormSelect
        label="Complaint Type *"
        id="complaintType"
        value={data.complaintType}
        onChange={(value) => onUpdate('complaintType', value)}
        options={COMPLAINT_TYPES}
        required
        error={errors.complaintType}
        helpText="Select the category that best describes the complaint"
      />

      <FormInput
        label="Complaint Date *"
        id="complaintDate"
        type="date"
        value={data.complaintDate}
        onChange={(value) => onUpdate('complaintDate', value)}
        required
        error={errors.complaintDate}
        helpText="When was the complaint reported?"
      />

      <FormTextArea
        label="Detailed Complaint Description *"
        id="description"
        value={data.description}
        onChange={(value) => onUpdate('description', value)}
        placeholder="Provide detailed information about the complaint..."
        required
        rows={6}
        maxLength={2000}
        error={errors.description}
        helpText="Include specific details about the issue, symptoms, or observations"
      />
    </div>
  );
};

export default ComplaintDetailsSection;
