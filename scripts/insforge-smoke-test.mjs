#!/usr/bin/env node
// Optional smoke test for a fork's Insforge project.
// Requires NEXT_PUBLIC_INSFORGE_URL and INSFORGE_API_KEY in the environment.

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@insforge/sdk";

function loadEnvFile(file) {
  const path = resolve(process.cwd(), file);
  if (!existsSync(path)) return;
  const lines = readFileSync(path, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const idx = trimmed.indexOf("=");
    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const URL = (process.env.NEXT_PUBLIC_INSFORGE_URL ?? "").trim();
const ADMIN_KEY = (process.env.INSFORGE_API_KEY ?? "").trim();

if (!URL || !ADMIN_KEY) {
  console.error(
    "Missing NEXT_PUBLIC_INSFORGE_URL or INSFORGE_API_KEY. Copy .env.example to .env.local and fill Insforge values first.",
  );
  process.exit(1);
}

const TEST_EMAIL = `smoke-${Date.now()}@meetnote.test`;
const TEST_PASSWORD = "smoke-test-1234";

async function admin(path, init = {}) {
  const r = await fetch(URL + path, {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      Authorization: `Bearer ${ADMIN_KEY}`,
      "Content-Type": "application/json",
    },
  });
  const text = await r.text();
  return { status: r.status, body: text ? JSON.parse(text) : null };
}

async function step(label, fn) {
  process.stdout.write(`- ${label}... `);
  try {
    const result = await fn();
    console.log("ok");
    return { ok: true, result };
  } catch (e) {
    console.log(`failed\n  ${e.message ?? e}`);
    return { ok: false, error: e };
  }
}

console.log("\n=== Insforge Smoke Test ===\n");

await step("tables exist", async () => {
  const profiles = await admin("/api/database/records/profiles?limit=0");
  if (profiles.status !== 200) throw new Error(`profiles list ${profiles.status}`);
  const notes = await admin("/api/database/records/notes?limit=0");
  if (notes.status !== 200) throw new Error(`notes list ${notes.status}`);
  const events = await admin("/api/database/records/webhook_events?limit=0");
  if (events.status !== 200)
    throw new Error(`webhook_events list ${events.status}`);
});

await step("auth config allows smoke signup", async () => {
  const r = await admin("/api/auth/config");
  if (r.body.requireEmailVerification !== false) {
    throw new Error("requireEmailVerification is true");
  }
});

console.log(`\n  Test email: ${TEST_EMAIL}`);
const insforge = createClient({ baseUrl: URL });

const signUp = await step("SDK signUp creates test account", async () => {
  const { data, error } = await insforge.auth.signUp({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
    name: "Smoke Test",
  });
  if (error) throw new Error(error.message);
  if (!data?.accessToken) throw new Error("missing accessToken");
  if (!data?.user?.id) throw new Error("missing user.id");
  return data;
});

if (!signUp.ok) {
  console.log("\nSign-up failed; skipping trigger/RPC checks.");
  process.exit(1);
}

const userId = signUp.result.user.id;
console.log(`  user.id = ${userId}`);

await step("profile trigger created profile row", async () => {
  await new Promise((r) => setTimeout(r, 500));
  const r = await admin(
    `/api/database/records/profiles?id=eq.${encodeURIComponent(userId)}`,
  );
  if (r.status !== 200) throw new Error(`profile lookup ${r.status}`);
  if (!r.body || r.body.length === 0) throw new Error("profile row missing");
  const profile = r.body[0];
  if (profile.email !== TEST_EMAIL) throw new Error("profile email mismatch");
  if (profile.plan !== "free") throw new Error("profile plan is not free");
});

await step("increment_minutes RPC works", async () => {
  const r = await admin("/api/database/rpc/increment_minutes", {
    method: "POST",
    body: JSON.stringify({ p_user: userId, p_delta: 5 }),
  });
  if (r.status !== 200 && r.status !== 204)
    throw new Error(`increment_minutes ${r.status}`);
  const after = await admin(
    `/api/database/records/profiles?id=eq.${encodeURIComponent(userId)}`,
  );
  if (after.body[0].monthly_minutes_used !== 5) {
    throw new Error(
      `monthly_minutes_used expected 5, got ${after.body[0].monthly_minutes_used}`,
    );
  }
});

await step("increment_summaries RPC works", async () => {
  await admin("/api/database/rpc/increment_summaries", {
    method: "POST",
    body: JSON.stringify({ p_user: userId }),
  });
  const after = await admin(
    `/api/database/records/profiles?id=eq.${encodeURIComponent(userId)}`,
  );
  if (after.body[0].monthly_summaries_used !== 1) {
    throw new Error(
      `monthly_summaries_used expected 1, got ${after.body[0].monthly_summaries_used}`,
    );
  }
});

await step("accessToken resolves current user", async () => {
  const r = await fetch(`${URL}/api/auth/sessions/current`, {
    headers: { Authorization: `Bearer ${signUp.result.accessToken}` },
  });
  if (!r.ok) throw new Error(`sessions/current ${r.status}`);
  const data = await r.json();
  if (data.user?.id !== userId) throw new Error("current user mismatch");
});

await step("signInWithPassword works", async () => {
  const { data, error } = await insforge.auth.signInWithPassword({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  });
  if (error) throw new Error(error.message);
  if (!data?.accessToken) throw new Error("missing sign-in token");
});

await step("cleanup profile row", async () => {
  await admin(`/api/database/records/profiles?id=eq.${encodeURIComponent(userId)}`, {
    method: "DELETE",
  });
});

console.log("\nInsforge smoke test completed.\n");
