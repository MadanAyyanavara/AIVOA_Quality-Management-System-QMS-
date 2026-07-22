import React from 'react';
import { RiskAnalysisResult } from '../hooks/useRiskAnalysis';

interface RiskAnalysisPanelProps {
  result: RiskAnalysisResult;
  isLoading?: boolean;
  error?: string | null;
  onClose?: () => void;
}

export const RiskAnalysisPanel: React.FC<RiskAnalysisPanelProps> = ({
  result,
  isLoading = false,
  error,
  onClose,
}) => {
  const getRiskColor = (level: string): string => {
    switch (level.toLowerCase()) {
      case 'critical':
        return 'bg-red-50 border-red-200 text-red-700';
      case 'high':
        return 'bg-orange-50 border-orange-200 text-orange-700';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'low':
        return 'bg-green-50 border-green-200 text-green-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDuplicateIcon = (): string => {
    return result.duplicateFlag ? '⚠️' : '✓';
  };

  const getDuplicateText = (): string => {
    return result.duplicateFlag
      ? 'Potential duplicate detected - recommend batch review'
      : 'No obvious duplicates detected';
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-sm font-medium text-red-800">Analysis Error:</p>
        <p className="text-sm text-red-700 mt-1">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center space-x-3">
        <svg
          className="animate-spin h-5 w-5 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p className="text-sm font-medium text-blue-800">
          Analyzing complaint risk...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center">
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
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          AI Risk Analysis Results
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Risk Level */}
      <div className={`border rounded-lg p-3 ${getRiskColor(result.riskLevel)}`}>
        <p className="text-xs font-semibold uppercase tracking-wide">
          Risk Level
        </p>
        <p className="text-lg font-bold mt-1">{result.riskLevel}</p>
      </div>

      {/* Completeness Score */}
      <div className="bg-white rounded-lg p-3 border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-gray-700 uppercase">
            Data Completeness
          </p>
          <span className={`text-lg font-bold ${getScoreColor(result.completenessScore)}`}>
            {result.completenessScore}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              result.completenessScore >= 80
                ? 'bg-green-500'
                : result.completenessScore >= 60
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`}
            style={{ width: `${result.completenessScore}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-600 mt-2">
          All critical fields are filled in
        </p>
      </div>

      {/* Root Cause Suggestion */}
      <div className="bg-white rounded-lg p-3 border border-gray-200">
        <p className="text-xs font-semibold text-gray-700 uppercase mb-2">
          Root Cause Suggestion
        </p>
        <p className="text-sm text-gray-700 leading-relaxed">
          {result.rootCauseSuggestion}
        </p>
      </div>

      {/* CAPA Recommendation */}
      <div className="bg-white rounded-lg p-3 border border-gray-200">
        <p className="text-xs font-semibold text-gray-700 uppercase mb-2">
          Corrective & Preventive Action (CAPA)
        </p>
        <p className="text-sm text-gray-700 leading-relaxed">
          {result.capaRecommendation}
        </p>
      </div>

      {/* Duplicate Flag */}
      <div
        className={`rounded-lg p-3 border ${
          result.duplicateFlag
            ? 'bg-orange-50 border-orange-200'
            : 'bg-green-50 border-green-200'
        }`}
      >
        <div className="flex items-start space-x-2">
          <span className="text-xl">{getDuplicateIcon()}</span>
          <div>
            <p
              className={`text-xs font-semibold uppercase ${
                result.duplicateFlag
                  ? 'text-orange-700'
                  : 'text-green-700'
              }`}
            >
              Duplicate Detection
            </p>
            <p
              className={`text-sm mt-1 ${
                result.duplicateFlag
                  ? 'text-orange-700'
                  : 'text-green-700'
              }`}
            >
              {getDuplicateText()}
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg p-3 border border-blue-200">
        <p className="text-xs font-semibold text-blue-900 uppercase mb-2">
          Analysis Summary
        </p>
        <ul className="text-xs text-gray-700 space-y-1">
          <li>✓ Data completeness: {result.completenessScore}%</li>
          <li>✓ Risk level assigned: {result.riskLevel}</li>
          <li>✓ Duplicate check: {getDuplicateText()}</li>
          <li>✓ Ready for investigation and CAPA implementation</li>
        </ul>
      </div>
    </div>
  );
};

export default RiskAnalysisPanel;
