import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ExtractionState } from '../../types';

const initialState: ExtractionState = {
  isExtracting: false,
  progress: 0,
  status: 'idle',
  error: null,
  extractedText: null,
  uploadedFileName: null,
};

const extractionSlice = createSlice({
  name: 'extraction',
  initialState,
  reducers: {
    uploadStart: (state, action: PayloadAction<string>) => {
      state.isExtracting = true;
      state.status = 'uploading';
      state.progress = 0;
      state.uploadedFileName = action.payload;
      state.error = null;
    },

    uploadProgress: (state, action: PayloadAction<number>) => {
      state.progress = action.payload;
    },

    extractionStart: (state) => {
      state.status = 'extracting';
      state.progress = 30;
    },

    extractionProgress: (state, action: PayloadAction<number>) => {
      state.progress = Math.min(action.payload, 95);
    },

    extractionSuccess: (
      state,
      action: PayloadAction<{ text: string; progress: number }>
    ) => {
      state.status = 'completed';
      state.isExtracting = false;
      state.progress = 100;
      state.extractedText = action.payload.text;
      state.error = null;
    },

    extractionError: (state, action: PayloadAction<string>) => {
      state.status = 'error';
      state.isExtracting = false;
      state.error = action.payload;
      state.progress = 0;
    },

    pasteTextSuccess: (
      state,
      action: PayloadAction<{ text: string; source: string }>
    ) => {
      state.extractedText = action.payload.text;
      state.uploadedFileName = `Text input - ${action.payload.source}`;
      state.status = 'completed';
      state.progress = 100;
      state.error = null;
    },

    resetExtraction: (state) => {
      state.isExtracting = false;
      state.progress = 0;
      state.status = 'idle';
      state.error = null;
      state.extractedText = null;
      state.uploadedFileName = null;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  uploadStart,
  uploadProgress,
  extractionStart,
  extractionProgress,
  extractionSuccess,
  extractionError,
  pasteTextSuccess,
  resetExtraction,
  clearError,
} = extractionSlice.actions;

export default extractionSlice.reducer;
