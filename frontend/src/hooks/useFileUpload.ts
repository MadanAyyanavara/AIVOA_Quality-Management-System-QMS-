import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  uploadStart,
  uploadProgress,
  extractionStart,
  extractionProgress,
  extractionSuccess,
  extractionError,
  resetExtraction,
} from '../redux/slices/extractionSlice';
import { validateFile } from '../utils/validation';
import { extractTextFromFile } from '../utils/formHelpers';
import { extractComplaint } from '../services/api';
import { RootState, AppDispatch } from '../redux/store';

export const useFileUpload = () => {
  const dispatch = useDispatch<AppDispatch>();
  const extraction = useSelector((state: RootState) => state.extraction);

  const handleFileUpload = useCallback(
    async (file: File) => {
      // Validate file
      const validation = validateFile(file);
      if (!validation.isValid) {
        dispatch(extractionError(validation.error || 'Invalid file'));
        return;
      }

      // Start upload
      dispatch(uploadStart(file.name));

      try {
        // Extract text from file
        const text = await extractTextFromFile(file);
        dispatch(uploadProgress(30));

        // Start extraction
        dispatch(extractionStart());

        // Call API to extract complaint data
        await extractComplaint(text, (progress: number) => {
          dispatch(extractionProgress(Math.min(progress, 95)));
        });

        // Success
        dispatch(
          extractionSuccess({
            text,
            progress: 100,
          })
        );

        return text;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to process file';
        dispatch(extractionError(errorMessage));
        throw error;
      }
    },
    [dispatch]
  );

  const handleTextPaste = useCallback(
    async (text: string) => {
      if (!text.trim()) {
        dispatch(extractionError('Please paste some text'));
        return;
      }

      dispatch(uploadStart('Pasted text'));

      try {
        dispatch(uploadProgress(20));
        dispatch(extractionStart());

        // Call API to extract complaint data
        await extractComplaint(text.trim(), (progress: number) => {
          dispatch(extractionProgress(Math.min(progress, 95)));
        });

        dispatch(
          extractionSuccess({
            text: text.trim(),
            progress: 100,
          })
        );

        return text;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to process text';
        dispatch(extractionError(errorMessage));
        throw error;
      }
    },
    [dispatch]
  );

  const reset = useCallback(() => {
    dispatch(resetExtraction());
  }, [dispatch]);

  return {
    extraction,
    handleFileUpload,
    handleTextPaste,
    reset,
  };
};
