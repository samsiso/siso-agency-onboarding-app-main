-- Add cycle-related fields to auto_prompts table
ALTER TABLE auto_prompts
ADD COLUMN cycle_number integer DEFAULT 1,
ADD COLUMN cycle_step text CHECK (cycle_step IN ('review', 'analysis', 'innovation', 'planning', 'execution_1', 'execution_2', 'execution_3', 'final_review')),
ADD COLUMN cycle_status text DEFAULT 'in_progress' CHECK (cycle_status IN ('in_progress', 'completed'));

-- Add index for efficient cycle querying
CREATE INDEX idx_auto_prompts_cycle ON auto_prompts (page_name, cycle_number, cycle_step);

-- Update existing prompts to have default cycle values
UPDATE auto_prompts
SET cycle_step = 
  CASE 
    WHEN prompt_type = 'analyze' THEN 'analysis'
    WHEN prompt_type = 'plan' THEN 'planning'
    WHEN prompt_type = 'code' THEN 'execution_1'
    WHEN prompt_type = 'review' THEN 'final_review'
    WHEN prompt_type = 'improve' THEN 'innovation'
    ELSE 'review'
  END
WHERE cycle_step IS NULL; 