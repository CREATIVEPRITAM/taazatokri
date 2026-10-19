import { useState, useEffect, useCallback } from 'react';
import {
  fetchDeliveryOverviewMetrics,
  calculateDeliveryOverview,
  DeliveryOverviewMetrics,
} from '../services/dashboardService';

export interface UseDeliveryOverviewOptions {
  selectedDate: string;
  preloadedMetrics?: {
    delivered: number;
    inTransit: number;
    pending: number;
    failed: number;
  };
  preloadedLoading?: boolean;
  preloadedError?: string | null;
  onRetry?: () => void;
}

export interface UseDeliveryOverviewReturn {
  data: DeliveryOverviewMetrics;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const EMPTY_DELIVERY_OVERVIEW: DeliveryOverviewMetrics = {
  delivered: 0,
  inTransit: 0,
  pending: 0,
  failed: 0,
  totalRelevantOrders: 0,
  completionPercentage: 0,
  deliveredPct: 0,
  inTransitPct: 0,
  pendingPct: 0,
  failedPct: 0,
};

export function useDeliveryOverview(
  options: UseDeliveryOverviewOptions | string
): UseDeliveryOverviewReturn {
  const selectedDate = typeof options === 'string' ? options : options.selectedDate;
  const preloadedMetrics = typeof options === 'object' ? options.preloadedMetrics : undefined;
  const preloadedLoading = typeof options === 'object' ? options.preloadedLoading : undefined;
  const preloadedError = typeof options === 'object' ? options.preloadedError : undefined;
  const onRetry = typeof options === 'object' ? options.onRetry : undefined;

  const [data, setData] = useState<DeliveryOverviewMetrics>(() => {
    if (preloadedMetrics) {
      return calculateDeliveryOverview(preloadedMetrics);
    }
    return EMPTY_DELIVERY_OVERVIEW;
  });
  const [loading, setLoading] = useState<boolean>(preloadedLoading ?? true);
  const [error, setError] = useState<string | null>(preloadedError ?? null);

  // Re-sync if preloaded metrics update (zero duplicate Firestore reads)
  useEffect(() => {
    if (preloadedMetrics !== undefined) {
      setData(calculateDeliveryOverview(preloadedMetrics));
      setLoading(preloadedLoading ?? false);
      setError(preloadedError ?? null);
    }
  }, [
    preloadedMetrics?.delivered,
    preloadedMetrics?.inTransit,
    preloadedMetrics?.pending,
    preloadedMetrics?.failed,
    preloadedLoading,
    preloadedError,
  ]);

  const loadData = useCallback(async () => {
    if (onRetry) {
      onRetry();
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetchDeliveryOverviewMetrics(selectedDate);
      setData(res);
    } catch (err: any) {
      console.error('[useDeliveryOverview] Failed to fetch delivery overview:', err);
      setError('Unable to load delivery overview.');
    } finally {
      setLoading(false);
    }
  }, [selectedDate, onRetry]);

  // If not using preloaded metrics, fetch independently on date change
  useEffect(() => {
    if (preloadedMetrics === undefined) {
      loadData();
    }
  }, [selectedDate, preloadedMetrics === undefined, loadData]);

  return {
    data,
    loading: preloadedLoading ?? loading,
    error: preloadedError ?? error,
    refetch: loadData,
  };
}
