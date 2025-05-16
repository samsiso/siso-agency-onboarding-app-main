import { useState, useCallback } from 'react';

// Enhanced local storage hook with better error handling
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    // Don't try to access localStorage during SSR or when unavailable
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      // Safely check if localStorage is available and accessible
      if (!isLocalStorageAvailable()) {
        return initialValue;
      }
      
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If any error occurs, return initialValue
      console.warn(`Could not read "${key}" from localStorage:`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage.
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      
      // Only attempt to use localStorage if it's available
      if (typeof window !== 'undefined' && isLocalStorageAvailable()) {
        // Use try-catch for the actual storage operation
        try {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (storageError) {
          console.warn(`Could not save "${key}" to localStorage:`, storageError);
          // Continue with the state update but don't break if storage fails
        }
      }
    } catch (error) {
      console.error('Error updating state:', error);
      // Still update state even if there was an error with localStorage
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}

// Helper function to safely check if localStorage is available and accessible
function isLocalStorageAvailable(): boolean {
  try {
    // Try to access localStorage with a test key
    if (!window.localStorage) {
      return false;
    }
    
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    // Any errors indicate localStorage is not fully available
    return false;
  }
}
