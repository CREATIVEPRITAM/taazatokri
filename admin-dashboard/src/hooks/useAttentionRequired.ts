import { useState, useEffect, useCallback } from 'react';
import {
  fetchAttentionRequiredMetrics,
  AttentionRequiredMetrics,
} from '../services/dashboardService';

export interface UseAttentionRequiredReturn {
  data: AttentionRequiredMetrics;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const EMPTY_ATTENTION: AttentionRequiredMetrics = {
  unassignedOrders: 0,
  failedDeliveries: 0,
  totalFlagged: 0,
};

export function useAttentionRequired(selectedDate: string): UseAttentionRequiredReturn {
  const [data, setData] = useState<AttentionRequiredMetrics>(EMPTY_ATTENTION);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchAttentionRequiredMetrics(selectedDate);
      setData(res);
    } catch (err: any) {
      console.error('[useAttentionRequired] Failed to load attention metrics:', err);
      setError('Unable to load attention items.');
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
