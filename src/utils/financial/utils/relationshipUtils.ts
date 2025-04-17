
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
 * Transforms entity data to break deep type instantiation chains
 * Uses explicit typing with unknown to prevent recursive type chains
 */
export function transformEntityData<T>(data: unknown[], transformer: (item: any) => T): T[] {
  if (!data || !Array.isArray(data)) return [];
  
  // Cast to unknown array first to break recursive type chains
  return data.map(item => transformer(item));
}
