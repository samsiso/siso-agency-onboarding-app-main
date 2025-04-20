
/**
 * Helper utility to check if a relationship object from the database is valid
 * This helps prevent errors when accessing properties of potentially null relationships
 */
export function isValidRelationship(relation: any): boolean {
  return relation !== null && 
         relation !== undefined && 
         typeof relation === 'object' && 
         'id' in relation;
}
