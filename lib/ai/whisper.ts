import OpenAI from "openai";
import { env } from "@/lib/env";

let client: OpenAI | null = null;
function getClient() {
  if (!client) {
    if (!env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is required");
    client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  }
  return client;
}

export interface TranscribeResult {
  text: string;
  durationSeconds: number;
}

export async function transcribeAudio(file: File): Promise<TranscribeResult> {
  const openai = getClient();
  const result = await openai.audio.transcriptions.create({
    file,
    model: "whisper-1",
    response_format: "verbose_json",
  });

  return {
    text: result.text,
    durationSeconds: Math.round(result.duration ?? 0),
  };
}
