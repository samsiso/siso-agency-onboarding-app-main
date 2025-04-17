
import { FinancialSummary } from '../types';

/**
 * Interface for summary period options
 */
export type SummaryPeriod = 'month' | 'year';

/**
 * Interface for monthly revenue data
 */
export interface MonthlyRevenue {
  name: string;
  revenue: number;
  expense: number;
}

/**
 * Summary filters interface
 */
export interface SummaryFilters {
  period?: SummaryPeriod;
  startDate?: string;
  endDate?: string;
}
