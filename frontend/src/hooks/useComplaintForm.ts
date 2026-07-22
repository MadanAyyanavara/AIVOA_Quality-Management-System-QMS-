import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateFormField,
  populateFormFromExtraction,
  resetForm,
  setFormError,
} from '../redux/slices/complaintSlice';
import { validateComplaintForm } from '../utils/validation';
import { RootState, AppDispatch } from '../redux/store';
import { ComplaintFormData } from '../types';

export const useComplaintForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const complaint = useSelector((state: RootState) => state.complaint);

  const updateField = useCallback(
    (field: keyof ComplaintFormData, value: any) => {
      dispatch(updateFormField({ field, value }));
    },
    [dispatch]
  );

  const populateFromExtraction = useCallback(
    (extractedData: Partial<ComplaintFormData>) => {
      dispatch(populateFormFromExtraction(extractedData));
    },
    [dispatch]
  );

  const reset = useCallback(() => {
    dispatch(resetForm());
  }, [dispatch]);

  const setError = useCallback(
    (error: string | null) => {
      dispatch(setFormError(error));
    },
    [dispatch]
  );

  const validate = useCallback(() => {
    const validation = validateComplaintForm(complaint.form);
    if (!validation.isValid) {
      dispatch(setFormError(validation.errors[0]));
    }
    return validation;
  }, [complaint.form, dispatch]);

  return {
    form: complaint.form,
    isLoading: complaint.isLoading,
    error: complaint.error,
    updateField,
    populateFromExtraction,
    reset,
    setError,
    validate,
  };
};
