import { redirect } from "next/navigation";
import Link from "next/link";
import { AppNav } from "@/components/app-nav";
import { planOf } from "@/lib/usage";
import { getOrCreateProfile } from "@/lib/profile";
import { getCurrentUser } from "@/lib/insforge/server";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?redirect_url=/settings");

  const profile = await getOrCreateProfile({
    userId: user.id,
    email: user.email,
  });
  const plan = planOf(profile);

  return (
    <>
      <AppNav email={user.email} />
      <main className="mx-auto max-w-3xl px-6 py-10 space-y-8">
        <h1 className="text-2xl font-bold">Settings</h1>

        <section className="rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="text-base font-bold">Account</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <Row label="Email" value={user.email} />
            <Row label="User ID" value={user.id} mono />
          </dl>
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="text-base font-bold">Subscription</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <Row label="Current plan" value={plan.toUpperCase()} />
            {profile.subscription_id && (
              <Row label="Subscription ID" value={profile.subscription_id} mono />
            )}
            {profile.current_period_end && (
              <Row
                label="Current period ends"
                value={new Date(profile.current_period_end).toLocaleString("en-US")}
              />
            )}
          </dl>
          <div className="mt-6">
            {plan === "free" ? (
              <Link
                href="/pricing"
                className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white"
              >
                Upgrade to Pro
              </Link>
            ) : (
              <p className="text-xs text-zinc-500">
                To cancel or update billing, please contact support.
              </p>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4 border-b border-zinc-100 pb-2 last:border-0">
      <dt className="text-zinc-500">{label}</dt>
      <dd className={mono ? "font-mono text-xs text-zinc-700" : "text-zinc-900"}>
        {value}
      </dd>
    </div>
  );
}
