import React from 'react';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import { ComplaintFormData } from '../types';

interface OriginCustomerSectionProps {
  data: ComplaintFormData;
  onUpdate: (field: keyof ComplaintFormData, value: string) => void;
  errors?: Record<string, string>;
}

const ORIGIN_SOURCES = [
  { value: 'Customer', label: 'Customer' },
  { value: 'Doctor', label: 'Doctor/Healthcare Provider' },
  { value: 'Hospital', label: 'Hospital/Clinic' },
  { value: 'Pharmacy', label: 'Pharmacy' },
  { value: 'Distributor', label: 'Distributor' },
  { value: 'Retailer', label: 'Retailer' },
  { value: 'Regulatory', label: 'Regulatory Authority' },
  { value: 'Other', label: 'Other' },
];

export const OriginCustomerSection: React.FC<OriginCustomerSectionProps> = ({
  data,
  onUpdate,
  errors = {},
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
          <span className="w-5 h-5 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold mr-2">
            1
          </span>
          Origin & Customer Details
        </h3>
      </div>

      <FormSelect
        label="Complaint Source *"
        id="originSource"
        value={data.originSource}
        onChange={(value) => onUpdate('originSource', value)}
        options={ORIGIN_SOURCES}
        required
        error={errors.originSource}
        helpText="Where did the complaint come from?"
      />

      <FormInput
        label="Customer/Reporter Name"
        id="customerName"
        type="text"
        value={data.customerName}
        onChange={(value) => onUpdate('customerName', value)}
        placeholder="Enter customer or reporter name"
        error={errors.customerName}
        helpText="Optional: Name of the person reporting the complaint"
      />
    </div>
  );
};

export default OriginCustomerSection;
