import React from 'react';

interface ExtractionProgressProps {
  progress: number; // 0-100
  status: 'idle' | 'uploading' | 'extracting' | 'completed' | 'error';
  error?: string | null;
  fileName?: string | null;
}

export const ExtractionProgress: React.FC<ExtractionProgressProps> = ({
  progress,
  status,
  error,
  fileName,
}) => {
  if (status === 'idle') {
    return null;
  }

  const statusLabels: Record<string, string> = {
    uploading: 'Uploading file...',
    extracting: 'Extracting complaint data...',
    completed: 'Extraction completed',
    error: 'Extraction failed',
  };

  const statusColors: Record<string, string> = {
    uploading: 'text-blue-600',
    extracting: 'text-blue-600',
    completed: 'text-green-600',
    error: 'text-red-600',
  };

  const progressBarColors: Record<string, string> = {
    uploading: 'bg-blue-500',
    extracting: 'bg-blue-500',
    completed: 'bg-green-500',
    error: 'bg-red-500',
  };

  return (
    <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${statusColors[status]}`}>
            {statusLabels[status]}
          </p>
          {fileName && (
            <p className="text-xs text-gray-500 mt-1">{fileName}</p>
          )}
        </div>
        <span className="text-sm font-semibold text-gray-700">{progress}%</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full ${progressBarColors[status]} transition-all duration-300 ease-out`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Status Steps */}
      <div className="flex items-center justify-between text-xs text-gray-600 pt-2">
        <div className="flex items-center space-x-1">
          {progress >= 25 ? (
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
          )}
          <span>Upload</span>
        </div>
        <div className="flex items-center space-x-1">
          {progress >= 60 ? (
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
          )}
          <span>Extract</span>
        </div>
        <div className="flex items-center space-x-1">
          {progress === 100 ? (
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
          )}
          <span>Complete</span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-xs">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default ExtractionProgress;
