import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthForm } from "@/components/auth/auth-form";
import { getCurrentUser } from "@/lib/insforge/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Try MeetNote AI for free",
};

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect_url?: string }>;
}) {
  const sp = await searchParams;
  const user = await getCurrentUser();
  if (user) redirect(sp.redirect_url ?? "/dashboard");

  return (
    <AuthShell
      title="Create account"
      subtitle="30 free minutes of transcription and 3 AI summaries per month"
      footer={
        <>
          Already have an account?{" "}
          <Link href="/sign-in" className="font-semibold text-zinc-900 underline">
            Sign in
          </Link>
        </>
      }
    >
      <Suspense fallback={<div className="h-40" />}>
        <AuthForm mode="sign-up" redirectTo={sp.redirect_url ?? "/dashboard"} />
      </Suspense>
    </AuthShell>
  );
}
