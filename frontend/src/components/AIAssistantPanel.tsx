import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { populateFormFromExtraction } from '../redux/slices/complaintSlice';
import { AppDispatch } from '../redux/store';
import FileUploadZone from './FileUploadZone';
import TextInputArea from './TextInputArea';
import ExtractionProgress from './ExtractionProgress';
import ChatComponent from './ChatComponent';
import RiskAnalysisPanel from './RiskAnalysisPanel';
import { useFileUpload } from '../hooks/useFileUpload';
import { useComplaintForm } from '../hooks/useComplaintForm';
import { useRiskAnalysis } from '../hooks/useRiskAnalysis';
import { validateComplaintForm } from '../utils/validation';

interface AIAssistantPanelProps {
  onExtractedData?: (data: any) => void;
}

export const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({
  onExtractedData,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { form } = useComplaintForm();
  const { result: riskResult, isLoading: isAnalyzingRisk, error: riskError, analyzeRisk, reset: resetRisk } = useRiskAnalysis();
  const { extraction, handleFileUpload, handleTextPaste, reset } = useFileUpload();
  const [activeTab, setActiveTab] = useState<'extraction' | 'chat' | 'risk'>('extraction');

  useEffect(() => {
    const validation = validateComplaintForm(form);
    const hasMinimumData = Boolean(
      form.originSource?.trim() &&
      form.productName?.trim() &&
      form.batchNumber?.trim() &&
      form.complaintType?.trim() &&
      form.complaintDate?.trim() &&
      form.description?.trim()
    );

    if (!hasMinimumData || !validation.isValid) {
      resetRisk();
      return;
    }

    const timer = window.setTimeout(() => {
      analyzeRisk(form).catch(() => undefined);
    }, 500);

    return () => window.clearTimeout(timer);
  }, [analyzeRisk, form, resetRisk]);

  const handleExtractedSuccess = () => {
    if (extraction.extractedText) {
      // Parse extracted JSON and populate form
      try {
        const extractedData = JSON.parse(extraction.extractedText);
        dispatch(populateFormFromExtraction(extractedData));
        onExtractedData?.(extractedData);
        setActiveTab('risk');
      } catch (e) {
        // If not JSON, just notify that text was extracted
        console.log('Extracted text (not JSON):', extraction.extractedText);
        setActiveTab('risk');
      }
    }
  };

  return (
    <div className="h-full bg-white rounded-lg border border-gray-200 flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          AI Complaint Intake Assistant
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Upload or paste complaint documents for automatic extraction
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        <button
          onClick={() => setActiveTab('extraction')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'extraction'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Extraction
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'chat'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Chat
          {extraction.status === 'completed' && (
            <span className="ml-1 inline-block w-2 h-2 bg-green-500 rounded-full"></span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('risk')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'risk'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Copilot Risk
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'extraction' && (
          <div className="p-6 space-y-6">
            {/* File Upload */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Upload Document
              </h3>
              <FileUploadZone
                onFileUpload={handleFileUpload}
                isLoading={extraction.isExtracting}
                fileName={extraction.uploadedFileName}
              />
            </div>

            {/* Extraction Progress */}
            {extraction.status !== 'idle' && (
              <ExtractionProgress
                progress={extraction.progress}
                status={extraction.status}
                error={extraction.error}
                fileName={extraction.uploadedFileName}
              />
            )}

            {/* Divider */}
            {extraction.status !== 'idle' && (
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">OR</span>
                </div>
              </div>
            )}

            {/* Text Paste Area */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Paste Complaint Text
              </h3>
              <TextInputArea
                onSubmit={handleTextPaste}
                isLoading={extraction.isExtracting}
              />
            </div>

            {/* Success Actions */}
            {extraction.status === 'completed' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
                <p className="text-sm font-medium text-green-800">
                  ✓ Extraction completed successfully!
                </p>
                <button
                  onClick={handleExtractedSuccess}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  Populate Form with Extracted Data
                </button>
                <button
                  onClick={reset}
                  className="w-full px-4 py-2 bg-white text-green-700 border border-green-300 rounded-lg hover:bg-green-50 transition-colors text-sm font-medium"
                >
                  Extract Another Document
                </button>
              </div>
            )}

            {/* Error State */}
            {extraction.error && extraction.status === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm font-medium text-red-800">Error:</p>
                <p className="text-sm text-red-700 mt-1">{extraction.error}</p>
                <button
                  onClick={reset}
                  className="mt-3 w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'chat' && <ChatComponent />}

        {activeTab === 'risk' && (
          <div className="p-4 space-y-3">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
              <p className="text-sm font-semibold text-blue-900">Auto Copilot Risk Assessment</p>
              <p className="text-xs text-blue-700 mt-1">
                The assistant now evaluates the complaint automatically whenever the form has enough data.
              </p>
            </div>

            {riskResult ? (
              <RiskAnalysisPanel
                result={riskResult}
                isLoading={isAnalyzingRisk}
                error={riskError}
                onClose={() => {
                  resetRisk();
                  setActiveTab('extraction');
                }}
              />
            ) : (
              <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-600">
                {isAnalyzingRisk
                  ? 'Evaluating complaint risk...'
                  : 'Complete the form to generate an auto risk assessment.'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistantPanel;
