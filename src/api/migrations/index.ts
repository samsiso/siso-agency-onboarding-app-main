import { enhanceResearchDocumentsTable } from './enhance-research-documents';

/**
 * Runs all migrations in the correct order
 */
export async function runMigrations() {
  console.log('Starting migrations...');
  
  try {
    // Run research documents table enhancement
    console.log('Running research documents table enhancement...');
    const result = await enhanceResearchDocumentsTable();
    
    if (!result.success) {
      console.error('Research documents migration failed:', result.error);
    } else {
      console.log('Research documents migration completed successfully!');
    }
    
    // Add other migrations here in the future

    console.log('All migrations completed!');
    return { success: true };
  } catch (error) {
    console.error('Unexpected error during migrations:', error);
    return { success: false, error };
  }
} 