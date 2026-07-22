import React from 'react';
import ComplaintIntakeForm from './ComplaintIntakeForm';
import AIAssistantPanel from './AIAssistantPanel';

export const ComplaintIntakeSystem: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <svg
              className="w-8 h-8 text-blue-600"
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
            <h1 className="text-3xl font-bold text-gray-900">
              Pharmaceutical QMS Complaint Intake System
            </h1>
          </div>
          <p className="text-gray-600 ml-11">
            AI-powered complaint extraction and management for pharmaceutical quality assurance
          </p>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          {/* Left Column - Complaint Form */}
          <div className="overflow-hidden">
            <ComplaintIntakeForm />
          </div>

          {/* Right Column - AI Assistant */}
          <div className="overflow-hidden">
            <AIAssistantPanel />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            © 2024 Pharmaceutical Quality Management System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComplaintIntakeSystem;
