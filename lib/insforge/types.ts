/**
 * MeetNote AI 的 DB row 型別。對應 migrations/20260429071058_init.sql。
 * 名稱與 DB 欄位（snake_case）一致，避免 mapping 錯誤。
 */

export type Plan = "free" | "pro" | "team";

export interface Profile {
  id: string; // Insforge auth.users.id（UUID 字串）
  email: string | null;
  display_name: string | null;
  plan: Plan;
  monthly_minutes_used: number;
  monthly_summaries_used: number;
  usage_period_start: string;
  subscription_id: string | null;
  current_period_end: string | null;
  welcomed_at: string | null;
  activation_email_sent_at: string | null;
  quota_warning_sent_at: string | null;
  quota_exceeded_sent_at: string | null;
  created_at: string;
}

export interface Note {
  id: string;
  user_id: string;
  title: string;
  source: "audio" | "transcript";
  audio_path: string | null;
  duration_seconds: number | null;
  transcript: string | null;
  summary: unknown; // JSONB（MeetingSummary）
  share_token: string | null;
  created_at: string;
}

export interface WebhookEvent {
  id: string;
  source: string;
  payload: unknown;
  processed_at: string;
}

export interface InsforgeUser {
  id: string;
  email: string;
  name?: string | null;
}
