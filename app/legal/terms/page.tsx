import type { Metadata } from "next";
import { LegalShell } from "../_components/legal-shell";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using MeetNote AI.",
};

export default function TermsPage() {
  return (
    <LegalShell title="Terms of Service" updatedAt="2026-04-29">
      <p>
        Welcome to MeetNote AI (the "service"). By using the service you agree
        to the following terms.
      </p>

      <h2>Service scope</h2>
      <p>
        MeetNote AI provides AI meeting-note services including, but not
        limited to, automatic audio transcription, structured summaries,
        action-item extraction, note storage, and sharing.
      </p>

      <h2>Account</h2>
      <ul>
        <li>You must provide a valid email to register an account.</li>
        <li>You are responsible for keeping your account password safe.</li>
        <li>Each account is for one person; resale or sharing is prohibited.</li>
      </ul>

      <h2>Plans and billing</h2>
      <ul>
        <li>Free plan: 30 minutes of transcription and 3 AI summaries per month.</li>
        <li>
          Pro plan: $9 USD per month — 600 minutes of transcription, unlimited
          summaries, and public share links.
        </li>
        <li>Payment is handled by a third-party payment processor.</li>
        <li>Subscriptions are billed monthly and renew automatically.</li>
        <li>
          Cancellations are not refunded. You may keep using the paid features
          until the end of the billing period, after which the account
          automatically returns to Free.
        </li>
      </ul>

      <h2>Acceptable use</h2>
      <p>The following are prohibited:</p>
      <ul>
        <li>
          Uploading unlawful content (including, without limitation: recordings
          made without consent, infringing material, or content that violates
          privacy or data-protection laws)
        </li>
        <li>
          Reverse engineering, cracking, or attempting to bypass usage limits
        </li>
        <li>
          Using automated tools to generate large volumes of requests (unless
          separately agreed)
        </li>
        <li>Use for harassment, fraud, or distribution of malicious content</li>
      </ul>

      <h2>Content ownership</h2>
      <ul>
        <li>You retain all rights to the content you upload.</li>
        <li>
          You grant us permission to process that content to provide the
          service (transcription, summarization, storage).
        </li>
        <li>
          We do not use your content to train AI models, and we do not publish
          or resell it.
        </li>
        <li>
          Generated transcripts and summaries are treated as derivative works
          and are owned by you.
        </li>
      </ul>

      <h2>Limitation of liability</h2>
      <ul>
        <li>
          AI-generated summaries and action items may be inaccurate. Verify
          them yourself; they should not be the sole basis for legal, medical,
          or financial decisions.
        </li>
        <li>
          We are not liable for losses caused by service interruptions, data
          loss, or third-party service failures, although we will work in good
          faith to keep the service stable.
        </li>
        <li>
          The service is provided "as is", without any express or implied
          warranties.
        </li>
      </ul>

      <h2>Service changes and termination</h2>
      <ul>
        <li>
          We may add, modify, or remove features from time to time. Material
          changes will be announced in advance.
        </li>
        <li>
          We may suspend or terminate accounts that violate these terms,
          without refund.
        </li>
        <li>
          You can delete your account at any time. Associated data is removed
          within 30 days of deletion.
        </li>
      </ul>

      <h2>Changes to these terms</h2>
      <p>
        Material changes will be sent by email to registered users, and the
        "Last updated" date on this page will be revised. Continued use
        constitutes acceptance of the new terms.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are interpreted and applied under the laws of the
        jurisdiction in which the service operator is established.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms? Email
        <a href="mailto:hello@meetnote.ai"> hello@meetnote.ai</a>.
      </p>
    </LegalShell>
  );
}
