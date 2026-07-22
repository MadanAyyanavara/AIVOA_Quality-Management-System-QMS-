import axios, { AxiosInstance } from 'axios';
import { ComplaintFormData } from '../types';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const API_TIMEOUT = parseInt(process.env.REACT_APP_API_TIMEOUT || '30000', 10);

// Create Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error handling
export interface ApiError {
  message: string;
  status?: number;
  detail?: string;
}

const handleApiError = (error: any): ApiError => {
  if (axios.isAxiosError(error)) {
    return {
      message: error.response?.data?.detail || error.message,
      status: error.response?.status,
      detail: JSON.stringify(error.response?.data),
    };
  }
  return {
    message: error instanceof Error ? error.message : 'An unknown error occurred',
  };
};

// API Endpoints

/**
 * Extract complaint data from raw text or document
 */
export const extractComplaint = async (
  text: string,
  onProgress?: (progress: number) => void
): Promise<ComplaintFormData> => {
  try {
    // Simulate progress during upload
    onProgress?.(25);

    const response = await apiClient.post('/api/extract', { text });

    onProgress?.(75);

    if (!response.data.success) {
      throw new Error(response.data.error || 'Extraction failed');
    }

    onProgress?.(100);

    // Convert extracted data to form data format
    const extractedData = response.data.extracted_data;
    return {
      originSource: extractedData.origin_source || '',
      customerName: extractedData.customer_name || '',
      productName: extractedData.product_name || '',
      productStrength: extractedData.product_strength || '',
      batchNumber: extractedData.batch_number || '',
      mfgDate: extractedData.mfg_date || '',
      expiryDate: extractedData.expiry_date || '',
      quantityAffected: extractedData.quantity_affected || '',
      complaintType: extractedData.complaint_type || '',
      complaintDate: extractedData.complaint_date || '',
      description: extractedData.description || '',
      initialSeverity: extractedData.initial_severity || 'Medium',
      priority: extractedData.priority || 'Normal',
    };
  } catch (error) {
    const apiError = handleApiError(error);
    throw new Error(apiError.message);
  }
};

/**
 * Save complaint to database
 */
export const saveComplaint = async (
  formData: ComplaintFormData
): Promise<{ id: number; message: string }> => {
  try {
    const payload = {
      origin_source: formData.originSource,
      customer_name: formData.customerName,
      product_name: formData.productName,
      product_strength: formData.productStrength,
      batch_number: formData.batchNumber,
      mfg_date: formData.mfgDate,
      expiry_date: formData.expiryDate,
      quantity_affected: formData.quantityAffected,
      complaint_type: formData.complaintType,
      complaint_date: formData.complaintDate,
      description: formData.description,
      initial_severity: formData.initialSeverity,
      priority: formData.priority,
      status: 'Pending Triage',
    };

    const response = await apiClient.post('/api/complaints', payload);

    return {
      id: response.data.id,
      message: `Complaint saved successfully with ID: ${response.data.id}`,
    };
  } catch (error) {
    const apiError = handleApiError(error);
    throw new Error(apiError.message);
  }
};

/**
 * Chat with AI about complaint
 */
export const chatWithAI = async (
  complaintText: string,
  question: string
): Promise<string> => {
  try {
    const response = await apiClient.post('/api/chat', {
      complaint_text: complaintText,
      question,
    });

    if (!response.data.success) {
      throw new Error(response.data.error || 'Chat failed');
    }

    return response.data.answer;
  } catch (error) {
    const apiError = handleApiError(error);
    throw new Error(apiError.message);
  }
};

/**
 * Bonus Feature: Analyze complaint for risk and completeness
 */
export const analyzeComplaintRisk = async (
  formData: ComplaintFormData
): Promise<{
  completenessScore: number;
  rootCauseSuggestion: string;
  capaRecommendation: string;
  duplicateFlag: boolean;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
}> => {
  try {
    const payload = {
      origin_source: formData.originSource,
      customer_name: formData.customerName,
      product_name: formData.productName,
      product_strength: formData.productStrength,
      batch_number: formData.batchNumber,
      mfg_date: formData.mfgDate,
      expiry_date: formData.expiryDate,
      quantity_affected: formData.quantityAffected,
      complaint_type: formData.complaintType,
      complaint_date: formData.complaintDate,
      description: formData.description,
      initial_severity: formData.initialSeverity,
      priority: formData.priority,
    };

    const response = await apiClient.post('/api/analyze-risk', payload);

    if (!response.data.success) {
      throw new Error(response.data.error || 'Risk analysis failed');
    }

    return {
      completenessScore: response.data.completeness_score || 0,
      rootCauseSuggestion: response.data.root_cause_suggestion || '',
      capaRecommendation: response.data.capa_recommendation || '',
      duplicateFlag: response.data.duplicate_flag || false,
      riskLevel: response.data.risk_level || 'Medium',
    };
  } catch (error) {
    const apiError = handleApiError(error);
    throw new Error(apiError.message);
  }
};

/**
 * Check API health
 */
export const checkHealth = async (): Promise<boolean> => {
  try {
    const response = await apiClient.get('/health', { timeout: 5000 });
    return response.status === 200;
  } catch {
    return false;
  }
};

export default apiClient;
