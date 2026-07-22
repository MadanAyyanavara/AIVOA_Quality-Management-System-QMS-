import { ComplaintFormData } from '../types';

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validateDate = (date: string): boolean => {
  if (!date) return false;
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
};

export const validateComplaintForm = (
  form: ComplaintFormData
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Required field validation
  if (!form.originSource?.trim()) errors.push('Complaint source is required');
  if (!form.productName?.trim()) errors.push('Product name is required');
  if (!form.batchNumber?.trim()) errors.push('Batch number is required');
  if (!form.complaintType?.trim()) errors.push('Complaint type is required');
  if (!form.complaintDate?.trim()) errors.push('Complaint date is required');
  if (!form.description?.trim()) errors.push('Description is required');

  // Date validation
  if (form.complaintDate && !validateDate(form.complaintDate)) {
    errors.push('Invalid complaint date format');
  }
  if (form.mfgDate && !validateDate(form.mfgDate)) {
    errors.push('Invalid manufacturing date format');
  }
  if (form.expiryDate && !validateDate(form.expiryDate)) {
    errors.push('Invalid expiry date format');
  }

  // Date logic validation
  if (form.mfgDate && form.expiryDate) {
    const mfgDate = new Date(form.mfgDate);
    const expiryDate = new Date(form.expiryDate);
    if (mfgDate >= expiryDate) {
      errors.push('Expiry date must be after manufacturing date');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const getFieldError = (
  fieldName: string,
  errors: string[]
): string | null => {
  const error = errors.find((e) =>
    e.toLowerCase().includes(fieldName.toLowerCase())
  );
  return error || null;
};

export const validateFile = (
  file: File,
  maxSizeMB: number = 10
): { isValid: boolean; error: string | null } => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'message/rfc822',
  ];

  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `File size exceeds ${maxSizeMB}MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
    };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Invalid file type. Only PDF, DOCX, TXT, and EML files are allowed.',
    };
  }

  return { isValid: true, error: null };
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};
