import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthForm } from "@/components/auth/auth-form";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/insforge/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to MeetNote AI",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect_url?: string }>;
}) {
  const sp = await searchParams;
  const user = await getCurrentUser();
  if (user) redirect(sp.redirect_url ?? "/dashboard");

  return (
    <AuthShell
      title="Sign in"
      subtitle="Continue organizing your meetings"
      footer={
        <>
          No account yet?{" "}
          <Link href="/sign-up" className="font-semibold text-zinc-900 underline">
            Create one for free
          </Link>
        </>
      }
    >
      <Suspense fallback={<div className="h-40" />}>
        <AuthForm mode="sign-in" redirectTo={sp.redirect_url ?? "/dashboard"} />
      </Suspense>
    </AuthShell>
  );
}
