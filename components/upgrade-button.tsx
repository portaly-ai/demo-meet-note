"use client";

// TODO: wire payment provider — disabled stub. Restore the onClick fetch flow
// once /api/checkout and the webhook handler are connected.
// Original flow: fetch POST /api/checkout → receive provider paymentUrl →
// window.location redirect to the checkout page.

export function UpgradeButton({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <button disabled className={className} title="Payment is coming soon">
        {children}
      </button>
      <p className="mt-3 text-center text-xs text-zinc-500">
        Payment is coming soon
      </p>
    </>
  );
}
