import { useState, useEffect, useCallback } from 'react';
import {
  fetchPurchaseRequirementPreview,
  PurchaseRequirementPreviewResult,
} from '../services/dashboardService';

export interface UsePurchaseRequirementPreviewReturn {
  data: PurchaseRequirementPreviewResult;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const EMPTY_PREVIEW: PurchaseRequirementPreviewResult = {
  items: [],
  totalRequirementsCount: 0,
  selectedDate: '',
};

export function usePurchaseRequirementPreview(
  selectedDate: string
): UsePurchaseRequirementPreviewReturn {
  const [data, setData] = useState<PurchaseRequirementPreviewResult>(EMPTY_PREVIEW);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchPurchaseRequirementPreview(selectedDate, 5);
      setData(res);
    } catch (err: any) {
      console.error('[usePurchaseRequirementPreview] Failed to load procurement preview:', err);
      setError('Unable to load purchase requirement preview.');
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    data,
    loading,
    error,
    refetch: loadData,
  };
}
