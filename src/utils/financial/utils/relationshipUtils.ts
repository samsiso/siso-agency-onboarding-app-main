
/**
 * Utility functions for handling database relationships and data transformations
 */

/**
 * Checks if an object is a valid relationship object (not an error response)
 */
export function isValidRelationship(obj: any): boolean {
  return obj && 
         typeof obj === 'object' && 
         !('code' in obj) && 
         !('message' in obj) && 
         !('details' in obj);
}

/**
 * Creates a client data object from a potentially invalid client relationship
 */
export function createClientData(clientObj: any): { full_name: string; business_name?: string } {
  if (!isValidRelationship(clientObj)) {
    return { full_name: 'Unknown' };
  }
  
  const businessName = clientObj.business_name || null;
  return {
    full_name: clientObj.full_name || 'Unknown',
    ...(businessName ? { business_name: businessName } : {})
  };
}

/**
 * Transforms database response data to match expected types
 * Breaks deep type instantiation by using type assertion
 */
export function transformEntityData<T>(
  data: unknown[], 
  transformer: (item: any) => T
): T[] {
  if (!data || !Array.isArray(data)) return [];
  
  // Type assertion to break infinite recursion
  return (data as any[]).map(item => transformer(item));
}
