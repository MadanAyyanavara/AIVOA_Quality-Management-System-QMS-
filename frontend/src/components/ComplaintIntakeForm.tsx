import React, { useState } from 'react';
import { useComplaintForm } from '../hooks/useComplaintForm';
import { useRiskAnalysis } from '../hooks/useRiskAnalysis';
import { validateComplaintForm } from '../utils/validation';
import { saveComplaint } from '../services/api';
import OriginCustomerSection from './OriginCustomerSection';
import ProductBatchSection from './ProductBatchSection';
import ComplaintDetailsSection from './ComplaintDetailsSection';
import AssessmentSection from './AssessmentSection';
import RiskAnalysisPanel from './RiskAnalysisPanel';

interface SaveStatus {
  status: 'idle' | 'saving' | 'success' | 'error';
  message: string;
  complaintId?: number;
}

export const ComplaintIntakeForm: React.FC = () => {
  const { form, error, updateField, reset } = useComplaintForm();
  const { result: riskAnalysis, isLoading: isAnalyzing, error: analysisError, analyzeRisk, reset: resetAnalysis } = useRiskAnalysis();
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [saveStatus, setSaveStatus] = useState<SaveStatus>({ status: 'idle', message: '' });
  const [showRiskAnalysis, setShowRiskAnalysis] = useState(false);

  const handleFieldChange = (field: any, value: string) => {
    updateField(field, value);
    // Clear validation error for this field
    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
    // Clear save status when user edits
    if (saveStatus.status === 'success') {
      setSaveStatus({ status: 'idle', message: '' });
    }
  };

  const handleSaveComplaint = async () => {
    const validation = validateComplaintForm(form);
    if (!validation.isValid) {
      const errorsMap: Record<string, string> = {};
      validation.errors.forEach((err) => {
        const field = err.split(' ')[0].toLowerCase();
        errorsMap[field] = err;
      });
      setValidationErrors(errorsMap);
      setSaveStatus({ status: 'error', message: 'Please fix validation errors' });
      return;
    }

    try {
      setSaveStatus({ status: 'saving', message: 'Saving complaint...' });

      const result = await saveComplaint(form);

      setSaveStatus({
        status: 'success',
        message: `Complaint saved successfully! ID: ${result.id}`,
        complaintId: result.id,
      });

      // Reset form after successful save
      setTimeout(() => {
        reset();
        setValidationErrors({});
        setSaveStatus({ status: 'idle', message: '' });
      }, 2000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save complaint';
      setSaveStatus({ status: 'error', message: errorMessage });
    }
  };

  const handleRiskAnalysis = async () => {
    const validation = validateComplaintForm(form);
    if (!validation.isValid) {
      const errorsMap: Record<string, string> = {};
      validation.errors.forEach((err) => {
        const field = err.split(' ')[0].toLowerCase();
        errorsMap[field] = err;
      });
      setValidationErrors(errorsMap);
      setSaveStatus({ status: 'error', message: 'Please fix validation errors before analyzing risk' });
      return;
    }

    try {
      await analyzeRisk(form);
      setShowRiskAnalysis(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to analyze risk';
      setSaveStatus({ status: 'error', message: errorMessage });
    }
  };

  const handleReset = () => {
    if (
      window.confirm(
        'Are you sure you want to clear all form fields?'
      )
    ) {
      reset();
      setValidationErrors({});
      setSaveStatus({ status: 'idle', message: '' });
      resetAnalysis();
      setShowRiskAnalysis(false);
    }
  };

  return (
    <div className="h-full bg-white rounded-lg border border-gray-200 flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h1 className="text-2xl font-bold text-gray-900">Log Customer Complaint</h1>
        <p className="text-sm text-gray-600 mt-1">
          API & FDF Quality Assurance Module
        </p>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Form Sections */}
        <OriginCustomerSection
          data={form}
          onUpdate={handleFieldChange}
          errors={validationErrors}
        />

        <div className="border-t border-gray-200 pt-6">
          <ProductBatchSection
            data={form}
            onUpdate={handleFieldChange}
            errors={validationErrors}
          />
        </div>

        <div className="border-t border-gray-200 pt-6">
          <ComplaintDetailsSection
            data={form}
            onUpdate={handleFieldChange}
            errors={validationErrors}
          />
        </div>

        <div className="border-t border-gray-200 pt-6">
          <AssessmentSection
            data={form}
            onUpdate={handleFieldChange}
            errors={validationErrors}
          />
        </div>

        {/* Global Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm font-medium text-red-800">Error:</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        )}

        {/* Save Status */}
        {saveStatus.status === 'saving' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center space-x-3">
            <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-sm font-medium text-blue-800">{saveStatus.message}</p>
          </div>
        )}

        {saveStatus.status === 'success' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-sm font-medium text-green-800">{saveStatus.message}</p>
            </div>
          </div>
        )}

        {saveStatus.status === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm font-medium text-red-800">Error:</p>
            <p className="text-sm text-red-700 mt-1">{saveStatus.message}</p>
          </div>
        )}

        {/* Risk Analysis Results */}
        {showRiskAnalysis && riskAnalysis && (
          <RiskAnalysisPanel
            result={riskAnalysis}
            isLoading={isAnalyzing}
            error={analysisError}
            onClose={() => setShowRiskAnalysis(false)}
          />
        )}
      </div>

      {/* Form Actions */}
      <div className="border-t border-gray-200 bg-gray-50 p-6 space-y-3">
        <div className="flex space-x-3">
          <button
            onClick={handleReset}
            disabled={saveStatus.status === 'saving' || isAnalyzing}
            className="flex-1 px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset Form
          </button>
          <button
            onClick={handleRiskAnalysis}
            disabled={saveStatus.status === 'saving' || isAnalyzing}
            className="flex-1 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isAnalyzing && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isAnalyzing ? 'Analyzing...' : '🔍 Analyze Risk'}
          </button>
          <button
            onClick={handleSaveComplaint}
            disabled={saveStatus.status === 'saving' || isAnalyzing}
            className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {saveStatus.status === 'saving' && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {saveStatus.status === 'saving' ? 'Saving...' : 'Save Complaint'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplaintIntakeForm;
