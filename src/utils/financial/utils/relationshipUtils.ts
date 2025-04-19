
/**
 * Checks if a relationship object is valid
 * @param obj The relationship object to check
 * @returns Boolean indicating if the relationship object is valid
 */
export function isValidRelationship(obj: any): boolean {
  return obj && typeof obj === 'object' && 'id' in obj && 'name' in obj;
}
