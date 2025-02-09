
-- Create function to update sync timestamps
CREATE OR REPLACE FUNCTION update_sync_timestamps()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.sync_status = 'in_progress' THEN
    NEW.sync_started_at = NOW();
  ELSIF NEW.sync_status = 'completed' THEN
    NEW.sync_completed_at = NOW();
    NEW.last_synced_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_sync_timestamps_trigger
  BEFORE UPDATE ON education_creators
  FOR EACH ROW
  WHEN (OLD.sync_status IS DISTINCT FROM NEW.sync_status)
  EXECUTE FUNCTION update_sync_timestamps();
