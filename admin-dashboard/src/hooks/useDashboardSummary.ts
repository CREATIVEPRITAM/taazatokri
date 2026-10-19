import { useState, useEffect, useCallback } from 'react';
import {
  fetchDashboardSummary,
  DashboardSummaryMetrics,
} from '../services/dashboardService';
import { getISTComponents } from '@taazatokri/shared';

export interface UseDashboardSummaryReturn {
  metrics: DashboardSummaryMetrics;
  loading: boolean;
  errors: string[];
  refetch: () => Promise<void>;
}

const EMPTY_METRICS: DashboardSummaryMetrics = {
  todayOrders: 0,
  pendingOrders: 0,
  outForDeliveryOrders: 0,
  deliveredToday: 0,
  failedOrders: 0,
  todayCodCollection: 0,
  totalCustomers: 0,
  activeDeliveryPartners: 0,
  totalProducts: 0,
  activeCategories: 0,
};

export function useDashboardSummary(targetDate?: string): UseDashboardSummaryReturn {
  const selectedDate = targetDate || getISTComponents().dateString;

  const [metrics, setMetrics] = useState<DashboardSummaryMetrics>(EMPTY_METRICS);
  const [loading, setLoading] = useState<boolean>(true);
  const [errors, setErrors] = useState<string[]>([]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchDashboardSummary(selectedDate);
      setMetrics(result.metrics);
      setErrors(result.errors);
    } catch (err: any) {
      console.error('[useDashboardSummary] Fatal error loading dashboard summary:', err);
      setErrors(['An unexpected error occurred while fetching dashboard summary data.']);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    metrics,
    loading,
    errors,
    refetch: loadData,
  };
}
