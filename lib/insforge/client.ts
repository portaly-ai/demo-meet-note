"use client";

import { createClient, type InsForgeClient } from "@insforge/sdk";

let _client: InsForgeClient | null = null;

/** 瀏覽器端 Insforge SDK；管理 access token、refresh、登入等。 */
export function getInsforge(): InsForgeClient {
  if (!_client) {
    const baseUrl = (process.env.NEXT_PUBLIC_INSFORGE_URL ?? "").trim();
    if (!baseUrl) {
      throw new Error("NEXT_PUBLIC_INSFORGE_URL is required");
    }
    _client = createClient({ baseUrl });
  }
  return _client;
}
