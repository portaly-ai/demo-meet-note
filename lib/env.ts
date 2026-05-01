function read(key: string): string {
  return (process.env[key] ?? "").trim();
}

export const env = {
  SITE_URL: read("NEXT_PUBLIC_SITE_URL") || "http://localhost:3000",

  // Insforge（Auth + DB + Storage + Functions + AI Gateway）
  INSFORGE_URL: read("NEXT_PUBLIC_INSFORGE_URL"),
  INSFORGE_API_KEY: read("INSFORGE_API_KEY"),

  // AI（也可改用 Insforge AI Gateway，但暫時保留直連）
  OPENAI_API_KEY: read("OPENAI_API_KEY"),
  ANTHROPIC_API_KEY: read("ANTHROPIC_API_KEY"),

  // Email
  RESEND_API_KEY: read("RESEND_API_KEY"),
  RESEND_FROM: read("RESEND_FROM") || "MeetNote AI <onboarding@resend.dev>",

  // Cron
  CRON_SECRET: read("CRON_SECRET"),
};
