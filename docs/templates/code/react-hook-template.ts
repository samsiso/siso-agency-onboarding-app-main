// File: hooks/useFeatureName.ts
import { useState, useEffect, useCallback, useRef } from 'react';

// Types for the hook
interface UseFeatureNameProps {
  /** Initial value for the data */
  initialValue?: any;
  /** Called on successful data fetch */
  onSuccess?: (data: any) => void;
  /** Called on error */
  onError?: (error: Error) => void;
  /** Auto-fetch on mount */
  autoFetch?: boolean;
  /** Debounce delay in milliseconds */
  debounceMs?: number;
}

interface UseFeatureNameReturn<T = any> {
  /** Current data state */
  data: T | null;
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: Error | null;
  /** Manually trigger data fetch */
  refetch: () => Promise<void>;
  /** Reset all states */
  reset: () => void;
  /** Set data manually */
  setData: (data: T) => void;
  /** Clear error state */
  clearError: () => void;
}

/**
 * Custom hook for managing feature state with TypeScript
 * 
 * @param options - Hook configuration options
 * @returns Hook state and methods
 * 
 * @example
 * ```tsx
 * const { data, loading, error, refetch } = useFeatureName({
 *   autoFetch: true,
 *   onSuccess: (data) => console.log('Success:', data),
 *   onError: (error) => console.error('Error:', error)
 * });
 * ```
 */
export const useFeatureName = <T = any>({
  initialValue = null,
  onSuccess,
  onError,
  autoFetch = true,
  debounceMs = 300
}: UseFeatureNameProps = {}): UseFeatureNameReturn<T> => {
  // State management
  const [data, setData] = useState<T | null>(initialValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Refs for cleanup and debouncing
  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Reset function
  const reset = useCallback(() => {
    cleanup();
    setData(initialValue);
    setError(null);
    setLoading(false);
  }, [initialValue, cleanup]);

  // Set data function with validation
  const setDataSafe = useCallback((newData: T) => {
    if (isMountedRef.current) {
      setData(newData);
    }
  }, []);

  // Main fetch function with error handling
  const fetchData = useCallback(async (): Promise<void> => {
    if (!isMountedRef.current) return;

    try {
      // Cleanup previous request
      cleanup();
      
      // Create new abort controller
      abortControllerRef.current = new AbortController();
      
      setLoading(true);
      setError(null);

      // Your API call here - replace with actual implementation
      const response = await fetch('/api/feature-endpoint', {
        signal: abortControllerRef.current.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (isMountedRef.current) {
        setData(result);
        onSuccess?.(result);
      }
    } catch (err) {
      if (isMountedRef.current && err.name !== 'AbortError') {
        const error = err instanceof Error ? err : new Error('Unknown error occurred');
        setError(error);
        onError?.(error);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [onSuccess, onError, cleanup]);

  // Debounced fetch function
  const debouncedFetch = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      fetchData();
    }, debounceMs);
  }, [fetchData, debounceMs]);

  // Effect for auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }

    return () => {
      isMountedRef.current = false;
      cleanup();
    };
  }, [autoFetch, fetchData, cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      cleanup();
    };
  }, [cleanup]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    reset,
    setData: setDataSafe,
    clearError
  };
};

// Alternative hook patterns for different use cases

/**
 * Hook for managing local storage with TypeScript
 */
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue] as const;
};

/**
 * Hook for managing API calls with caching
 */
export const useApiCache = <T>(endpoint: string, options?: RequestInit) => {
  const cacheKey = `api_cache_${endpoint}`;
  const [cachedData, setCachedData] = useLocalStorage<{data: T; timestamp: number} | null>(cacheKey, null);
  
  const { data, loading, error, refetch } = useFeatureName<T>({
    autoFetch: false,
    onSuccess: (data) => {
      setCachedData({
        data,
        timestamp: Date.now()
      });
    }
  });

  // Check if cache is valid (5 minutes)
  const isCacheValid = cachedData && (Date.now() - cachedData.timestamp) < 5 * 60 * 1000;

  useEffect(() => {
    if (isCacheValid) {
      // Use cached data
      return;
    }
    // Fetch fresh data
    refetch();
  }, [endpoint, isCacheValid, refetch]);

  return {
    data: isCacheValid ? cachedData.data : data,
    loading,
    error,
    refetch,
    clearCache: () => setCachedData(null)
  };
};

// Export types for external use
export type { UseFeatureNameProps, UseFeatureNameReturn }; 