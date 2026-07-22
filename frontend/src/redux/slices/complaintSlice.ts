import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ComplaintFormData, ComplaintState } from '../../types';

const initialFormData: ComplaintFormData = {
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

const initialState: ComplaintState = {
  form: initialFormData,
  isLoading: false,
  error: null,
};

const complaintSlice = createSlice({
  name: 'complaint',
  initialState,
  reducers: {
    updateFormField: (
      state,
      action: PayloadAction<{ field: keyof ComplaintFormData; value: any }>
    ) => {
      const { field, value } = action.payload;
      state.form[field] = value;
    },

    populateFormFromExtraction: (
      state,
      action: PayloadAction<Partial<ComplaintFormData>>
    ) => {
      state.form = { ...state.form, ...action.payload };
      state.error = null;
    },

    resetForm: (state) => {
      state.form = initialFormData;
      state.error = null;
    },

    setFormLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setFormError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    setComplaint: (state, action: PayloadAction<ComplaintFormData>) => {
      state.form = action.payload;
    },

    saveComplaintStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    saveComplaintSuccess: (state) => {
      state.isLoading = false;
      state.form = initialFormData;
    },

    saveComplaintError: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  updateFormField,
  populateFormFromExtraction,
  resetForm,
  setFormLoading,
  setFormError,
  setComplaint,
  saveComplaintStart,
  saveComplaintSuccess,
  saveComplaintError,
} = complaintSlice.actions;

export default complaintSlice.reducer;
