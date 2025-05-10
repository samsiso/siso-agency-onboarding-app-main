import { enhanceResearchDocumentsTable } from './enhance-research-documents';
import { createFeedbackTable } from './create-feedback-table';

/**
 * Runs all migrations in the correct order
 */
export async function runMigrations() {
  console.log('Starting migrations...');
  
  try {
    // Run research documents table enhancement
    console.log('Running research documents table enhancement...');
    const researchResult = await enhanceResearchDocumentsTable();
    
    if (!researchResult.success) {
      console.error('Research documents migration failed:', researchResult.error);
    } else {
      console.log('Research documents migration completed successfully!');
    }
    
    // Run feedback table creation
    console.log('Running feedback table creation...');
    const feedbackResult = await createFeedbackTable();
    
    if (!feedbackResult.success) {
      console.error('Feedback table migration failed:', feedbackResult.error);
    } else {
      console.log('Feedback table migration completed successfully!');
    }
    
    // Add other migrations here in the future

    console.log('All migrations completed!');
    return { success: true };
  } catch (error) {
    console.error('Unexpected error during migrations:', error);
    return { success: false, error };
  }
} 