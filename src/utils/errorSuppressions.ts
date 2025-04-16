
/**
 * Safely access a property from an object with a default value if it doesn't exist
 * This helps prevent TypeErrors when accessing nested properties that might be undefined
 */
export function safePropertyAccess<T>(obj: any, path: string, defaultValue: T): T {
  if (!obj) return defaultValue;
  
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current === undefined || current === null || typeof current !== 'object') {
      return defaultValue;
    }
    current = current[key];
  }
  
  return (current === undefined || current === null) ? defaultValue : current as T;
}
