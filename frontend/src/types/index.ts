export interface ComplaintFormData {
  // Origin & Customer
  originSource: string;
  customerName: string;

  // Product & Batch
  productName: string;
  productStrength: string;
  batchNumber: string;
  mfgDate: string;
  expiryDate: string;
  quantityAffected: string;

  // Complaint Details
  complaintType: string;
  complaintDate: string;
  description: string;

  // Assessment
  initialSeverity: 'Low' | 'Medium' | 'High' | 'Critical';
  priority: 'Low' | 'Normal' | 'High';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ExtractionStatus {
  isExtracting: boolean;
  progress: number; // 0-100
  status: 'idle' | 'uploading' | 'extracting' | 'completed' | 'error';
  error: string | null;
  extractedText: string | null;
}

export interface ComplaintState {
  form: ComplaintFormData;
  isLoading: boolean;
  error: string | null;
}

export interface ExtractionState extends ExtractionStatus {
  uploadedFileName: string | null;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

export interface RootState {
  complaint: ComplaintState;
  extraction: ExtractionState;
  chat: ChatState;
}

export type SeverityLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type PriorityLevel = 'Low' | 'Normal' | 'High';
