import { useCallback, useState } from 'react';
import { analyzeComplaintRisk } from '../services/api';
import { ComplaintFormData } from '../types';

export interface RiskAnalysisResult {
  completenessScore: number;
  rootCauseSuggestion: string;
  capaRecommendation: string;
  duplicateFlag: boolean;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
}

interface UseRiskAnalysisState {
  result: RiskAnalysisResult | null;
  isLoading: boolean;
  error: string | null;
}

export const useRiskAnalysis = () => {
  const [state, setState] = useState<UseRiskAnalysisState>({
    result: null,
    isLoading: false,
    error: null,
  });

  const analyzeRisk = useCallback(async (formData: ComplaintFormData) => {
    try {
      setState({ result: null, isLoading: true, error: null });

      const result = await analyzeComplaintRisk(formData);

      setState({ result, isLoading: false, error: null });
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to analyze risk';
      setState({ result: null, isLoading: false, error: errorMessage });
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ result: null, isLoading: false, error: null });
  }, []);

  return {
    ...state,
    analyzeRisk,
    reset,
  };
};
