import React from 'react';
import FormInput from './FormInput';
import { ComplaintFormData } from '../types';

interface ProductBatchSectionProps {
  data: ComplaintFormData;
  onUpdate: (field: keyof ComplaintFormData, value: string) => void;
  errors?: Record<string, string>;
}

export const ProductBatchSection: React.FC<ProductBatchSectionProps> = ({
  data,
  onUpdate,
  errors = {},
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
          <span className="w-5 h-5 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold mr-2">
            2
          </span>
          Product & Batch Identification
        </h3>
      </div>

      <FormInput
        label="Product Name *"
        id="productName"
        type="text"
        value={data.productName}
        onChange={(value) => onUpdate('productName', value)}
        placeholder="e.g., Aspirin, Ibuprofen"
        required
        error={errors.productName}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormInput
          label="Product Strength/Grade"
          id="productStrength"
          type="text"
          value={data.productStrength}
          onChange={(value) => onUpdate('productStrength', value)}
          placeholder="e.g., 500mg, 10%"
          error={errors.productStrength}
          helpText="Strength or grade of product"
        />

        <FormInput
          label="Batch/Lot Number *"
          id="batchNumber"
          type="text"
          value={data.batchNumber}
          onChange={(value) => onUpdate('batchNumber', value)}
          placeholder="e.g., AB-2024-001"
          required
          error={errors.batchNumber}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormInput
          label="Manufacturing Date"
          id="mfgDate"
          type="date"
          value={data.mfgDate}
          onChange={(value) => onUpdate('mfgDate', value)}
          error={errors.mfgDate}
          helpText="Manufacturing date (YYYY-MM-DD)"
        />

        <FormInput
          label="Expiry Date"
          id="expiryDate"
          type="date"
          value={data.expiryDate}
          onChange={(value) => onUpdate('expiryDate', value)}
          error={errors.expiryDate}
          helpText="Expiry date (YYYY-MM-DD)"
        />
      </div>

      <FormInput
        label="Quantity Affected"
        id="quantityAffected"
        type="text"
        value={data.quantityAffected}
        onChange={(value) => onUpdate('quantityAffected', value)}
        placeholder="e.g., 2 bottles, 10 tablets"
        error={errors.quantityAffected}
        helpText="Number of units affected"
      />
    </div>
  );
};

export default ProductBatchSection;
