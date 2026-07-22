import { ComplaintFormData } from '../types';

export const getPlaceholder = (fieldValue: string, defaultPlaceholder: string): string => {
  return !fieldValue ? 'Awaiting AI extraction...' : defaultPlaceholder;
};

export const getFieldClassName = (value: string, baseClass: string): string => {
  const opacity = !value ? 'opacity-50' : 'opacity-100';
  return `${baseClass} ${opacity} transition-opacity`;
};

export const formatDateForInput = (date: string | null): string => {
  if (!date) return '';
  return date.split('T')[0]; // Handle ISO datetime
};

export const formatDateForDisplay = (date: string | null): string => {
  if (!date) return '';
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return date;
  }
};

export const getSeverityColor = (severity: string): string => {
  switch (severity.toLowerCase()) {
    case 'critical':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'high':
      return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'medium':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'low':
      return 'text-green-600 bg-green-50 border-green-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

export const getPriorityColor = (priority: string): string => {
  switch (priority.toLowerCase()) {
    case 'high':
      return 'text-red-600 bg-red-50';
    case 'normal':
      return 'text-blue-600 bg-blue-50';
    case 'low':
      return 'text-green-600 bg-green-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

export const generateComplaintSummary = (form: ComplaintFormData): string => {
  const parts = [];

  if (form.productName) {
    parts.push(`Product: ${form.productName}`);
  }
  if (form.batchNumber) {
    parts.push(`Batch: ${form.batchNumber}`);
  }
  if (form.complaintType) {
    parts.push(`Type: ${form.complaintType}`);
  }
  if (form.initialSeverity) {
    parts.push(`Severity: ${form.initialSeverity}`);
  }

  return parts.length > 0 ? parts.join(' | ') : 'No details available';
};

export const resetFormFields = (): ComplaintFormData => {
  return {
    originSource: '',
    customerName: '',
    productName: '',
    productStrength: '',
    batchNumber: '',
    mfgDate: '',
    expiryDate: '',
    quantityAffected: '',
    complaintType: '',
    complaintDate: '',
    description: '',
    initialSeverity: 'Medium',
    priority: 'Normal',
  };
};

export const isFormEmpty = (form: ComplaintFormData): boolean => {
  return Object.values(form).every((value) =>
    value === '' || value === 'Medium' || value === 'Normal'
  );
};

export const extractTextFromFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target?.result as string;
      resolve(content);
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
};
