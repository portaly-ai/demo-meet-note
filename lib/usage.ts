import type { Profile, Plan } from "@/lib/insforge/types";

export type { Plan };

export const PLAN_LIMITS = {
  free: { minutesPerMonth: 30, summariesPerMonth: 3, canShare: false },
  pro: { minutesPerMonth: 600, summariesPerMonth: Infinity, canShare: true },
  team: { minutesPerMonth: Infinity, summariesPerMonth: Infinity, canShare: true },
} as const;

export function planOf(profile: Pick<Profile, "plan">): Plan {
  return (profile.plan as Plan) ?? "free";
}

export function checkTranscribeQuota(
  profile: Pick<Profile, "plan" | "monthly_minutes_used">,
  addMinutes: number,
) {
  const plan = planOf(profile);
  const limit = PLAN_LIMITS[plan].minutesPerMonth;
  const used = profile.monthly_minutes_used;
  const wouldBe = used + addMinutes;
  return { allowed: wouldBe <= limit, used, limit, wouldBe };
}

export function checkSummaryQuota(
  profile: Pick<Profile, "plan" | "monthly_summaries_used">,
) {
  const plan = planOf(profile);
  const limit = PLAN_LIMITS[plan].summariesPerMonth;
  return {
    allowed: profile.monthly_summaries_used < limit,
    used: profile.monthly_summaries_used,
    limit,
  };
}
