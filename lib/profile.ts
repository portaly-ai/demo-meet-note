import { adminDb } from "@/lib/insforge/server";
import type { Profile } from "@/lib/insforge/types";

/**
 * 透過 Insforge admin client 查/建 profile。
 *
 * 主要 case：DB trigger `on_auth_user_created` 已經在 Insforge auth signup 時
 * 自動建好 profile 了。但保留 fallback insert 處理 trigger 漏接的情況（例如
 * 早期帳號建立後才加 trigger，或 trigger 因 race / 權限失敗）。
 */
export async function getOrCreateProfile(args: {
  userId: string;
  email: string | null;
  displayName?: string | null;
}): Promise<Profile> {
  const existing = await adminDb.first<Profile>("profiles", {
    eq: { id: args.userId },
  });
  if (existing) return existing;

  // fallback: trigger 沒跑就自己 insert
  try {
    return await adminDb.insert<Profile>("profiles", {
      id: args.userId,
      email: args.email,
      display_name: args.displayName ?? null,
    });
  } catch {
    // race：另一個 request 剛 insert 完，再讀一次
    const refetched = await adminDb.first<Profile>("profiles", {
      eq: { id: args.userId },
    });
    if (!refetched) throw new Error(`Failed to get or create profile for ${args.userId}`);
    return refetched;
  }
}

export async function getProfile(userId: string): Promise<Profile | null> {
  return adminDb.first<Profile>("profiles", { eq: { id: userId } });
}

/** 把 email / displayName 同步到 profile（若有變動）。 */
export async function syncProfile(args: {
  userId: string;
  email: string | null;
  displayName?: string | null;
}): Promise<void> {
  const patch: Record<string, unknown> = {};
  if (args.email !== undefined) patch.email = args.email;
  if (args.displayName !== undefined) patch.display_name = args.displayName;
  if (Object.keys(patch).length === 0) return;
  await adminDb.update<Profile>("profiles", { id: args.userId }, patch);
}
