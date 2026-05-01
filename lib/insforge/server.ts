import { cookies } from "next/headers";
import { env } from "@/lib/env";
import type { InsforgeUser } from "./types";

/**
 * Server-side Insforge 助手。所有 server components / route handlers / proxy 都用這。
 *
 * Auth：sign-in 後 client 會 POST 到 /api/auth/session 把 accessToken 寫進
 * httpOnly cookie `insforge_access`。所以 server 端只要從 cookie 讀就能知道登入狀態。
 *
 * Database：Insforge 用 PostgREST 風格 API：
 *   - `/api/database/records/{table}?col=eq.value` for CRUD
 *   - `/api/database/rpc/{function_name}` for SQL functions
 *
 * 沒有 raw SQL endpoint，所以複雜邏輯（例如原子增量）一律在 migration 寫成
 * SQL function，再用 rpc() 呼叫。
 */

export const COOKIE_NAME = "insforge_access";

// ────────────────────────── Auth ──────────────────────────

/** 取得目前登入用戶；未登入或 token 過期都回 null。 */
export async function getCurrentUser(): Promise<InsforgeUser | null> {
  if (!env.INSFORGE_URL) return null;
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const r = await fetch(`${env.INSFORGE_URL}/api/auth/sessions/current`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!r.ok) return null;
  const data = (await r.json()) as { user?: InsforgeUser };
  return data.user ?? null;
}

// ────────────────────────── Low-level fetch ──────────────────────────

/** Admin fetch — 用 INSFORGE_API_KEY，能繞過 RLS。 */
async function adminFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  if (!env.INSFORGE_API_KEY)
    throw new Error("INSFORGE_API_KEY is required");
  const r = await fetch(`${env.INSFORGE_URL}${path}`, {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      Authorization: `Bearer ${env.INSFORGE_API_KEY}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  if (!r.ok) {
    const body = await r.text().catch(() => "");
    throw new Error(
      `Insforge admin ${init.method ?? "GET"} ${path} ${r.status}: ${body}`,
    );
  }
  if (r.status === 204) return undefined as T;
  return r.json() as Promise<T>;
}

/** User fetch — 用 cookie 中的 accessToken（受 RLS 保護）。 */
async function userFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) throw new Error("Not authenticated");
  const r = await fetch(`${env.INSFORGE_URL}${path}`, {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  if (!r.ok) {
    const body = await r.text().catch(() => "");
    throw new Error(
      `Insforge user ${init.method ?? "GET"} ${path} ${r.status}: ${body}`,
    );
  }
  if (r.status === 204) return undefined as T;
  return r.json() as Promise<T>;
}

// ────────────────────────── PostgREST helpers ──────────────────────────

interface ListOptions {
  /** 欄位等於：`{ id: "123" }` → `?id=eq.123` */
  eq?: Record<string, string | number | boolean>;
  /** 欄位 ILIKE：`{ title: "%foo%" }` → `?title=ilike.%25foo%25` */
  ilike?: Record<string, string>;
  /** OR 條件：`["title.ilike.%foo%", "transcript.ilike.%foo%"]` → `?or=(...)` */
  or?: string[];
  /** 欄位選擇：`["id", "title"]` → `?select=id,title` */
  select?: string[];
  /** 排序：`{ created_at: "desc" }` → `?order=created_at.desc` */
  order?: Record<string, "asc" | "desc">;
  /** 限制筆數 */
  limit?: number;
}

function toQueryString(opts: ListOptions = {}): string {
  const parts: string[] = [];
  if (opts.select)
    parts.push(`select=${encodeURIComponent(opts.select.join(","))}`);
  if (opts.eq) {
    for (const [k, v] of Object.entries(opts.eq)) {
      parts.push(`${encodeURIComponent(k)}=eq.${encodeURIComponent(String(v))}`);
    }
  }
  if (opts.ilike) {
    for (const [k, v] of Object.entries(opts.ilike)) {
      parts.push(`${encodeURIComponent(k)}=ilike.${encodeURIComponent(v)}`);
    }
  }
  if (opts.or && opts.or.length > 0) {
    parts.push(`or=(${opts.or.join(",")})`);
  }
  if (opts.order) {
    const orderStr = Object.entries(opts.order)
      .map(([k, dir]) => `${k}.${dir}`)
      .join(",");
    parts.push(`order=${encodeURIComponent(orderStr)}`);
  }
  if (opts.limit !== undefined) parts.push(`limit=${opts.limit}`);
  return parts.length > 0 ? `?${parts.join("&")}` : "";
}

/** Admin DB（繞過 RLS，server 端用） */
export const adminDb = {
  async list<T>(table: string, opts: ListOptions = {}): Promise<T[]> {
    return adminFetch<T[]>(
      `/api/database/records/${table}${toQueryString(opts)}`,
    );
  },
  async first<T>(table: string, opts: ListOptions = {}): Promise<T | null> {
    const rows = await this.list<T>(table, { ...opts, limit: 1 });
    return rows[0] ?? null;
  },
  async insert<T>(
    table: string,
    row: Record<string, unknown>,
    returning = true,
  ): Promise<T> {
    return adminFetch<T>(`/api/database/records/${table}`, {
      method: "POST",
      headers: returning ? { Prefer: "return=representation" } : {},
      body: JSON.stringify(row),
    }).then((r) => (Array.isArray(r) ? (r as T[])[0] : r));
  },
  async update<T>(
    table: string,
    eq: Record<string, string | number>,
    patch: Record<string, unknown>,
  ): Promise<T[]> {
    return adminFetch<T[]>(
      `/api/database/records/${table}${toQueryString({ eq })}`,
      {
        method: "PATCH",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify(patch),
      },
    );
  },
  async delete(
    table: string,
    eq: Record<string, string | number>,
  ): Promise<void> {
    await adminFetch<void>(
      `/api/database/records/${table}${toQueryString({ eq })}`,
      { method: "DELETE" },
    );
  },
  async rpc<T>(fn: string, args: Record<string, unknown> = {}): Promise<T> {
    return adminFetch<T>(`/api/database/rpc/${fn}`, {
      method: "POST",
      body: JSON.stringify(args),
    });
  },
};

/** User-scoped DB（受 RLS 限制，從 cookie 拿 token） */
export const userDb = {
  async list<T>(table: string, opts: ListOptions = {}): Promise<T[]> {
    return userFetch<T[]>(
      `/api/database/records/${table}${toQueryString(opts)}`,
    );
  },
  async first<T>(table: string, opts: ListOptions = {}): Promise<T | null> {
    const rows = await this.list<T>(table, { ...opts, limit: 1 });
    return rows[0] ?? null;
  },
};
