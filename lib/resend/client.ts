import { Resend } from "resend";
import { env } from "@/lib/env";

let client: Resend | null = null;
export function getResend() {
  if (!client) {
    if (!env.RESEND_API_KEY) throw new Error("RESEND_API_KEY is required");
    client = new Resend(env.RESEND_API_KEY);
  }
  return client;
}

export const FROM = env.RESEND_FROM;
