
/**
 * Checks if a relationship object is valid
 * @param obj The relationship object to check
 * @returns Boolean indicating if the relationship object is valid
 */
export function isValidRelationship(obj: any): boolean {
  return obj && typeof obj === 'object' && 'id' in obj && 'name' in obj;
}

/**
 * Creates a client data object from a potentially invalid client relationship
 * @param clientObj The client object from database
 * @returns A properly formatted client data object
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
 * @param data Array of raw data objects
 * @param transformer Function to transform each item
 * @returns Array of transformed objects with type T
 */
export function transformEntityData<T>(data: unknown[], transformer: (item: any) => T): T[] {
  if (!data || !Array.isArray(data)) return [];
  
  // Cast to unknown array first to break recursive type chains
  return data.map(item => transformer(item));
}
