
-- Create a function to safely get the daily summary
CREATE OR REPLACE FUNCTION get_daily_summary(target_date date)
RETURNS SETOF ai_news_daily_summaries AS $$
BEGIN
  RETURN QUERY 
  SELECT * FROM ai_news_daily_summaries 
  WHERE date = target_date
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant usage to all users, including unauthenticated ones
GRANT EXECUTE ON FUNCTION get_daily_summary(date) TO PUBLIC;
