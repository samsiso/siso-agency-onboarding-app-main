
export interface OutreachAccount {
  id: string;
  username: string;
  account_type: string;
  status: string;
  daily_dm_limit: number;
  daily_follow_limit: number;
  daily_comment_limit: number;
  created_at: string;
  updated_at: string;
  last_action_at: string | null;
  assigned_to: string | null;
}

export interface OutreachCampaign {
  id: string;
  name: string;
  description: string | null;
  status: string;
  target_audience: Record<string, any>;
  message_template: string | null;
  created_at: string;
  updated_at: string;
  start_date: string | null;
  end_date: string | null;
  created_by: string;
  metrics: Record<string, any>;
}
