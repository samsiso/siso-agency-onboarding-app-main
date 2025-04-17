
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
 * Generic type parameter T represents the final transformed shape
 */
export function transformEntityData<T>(
  data: any[], 
  transformer: (item: any) => T
): T[] {
  return (data || []).map(transformer);
}

