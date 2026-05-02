import type { Metadata } from "next";
import { LegalShell } from "../_components/legal-shell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How MeetNote AI collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy" updatedAt="2026-04-29">
      <p>
        MeetNote AI ("we", "the service") respects your privacy. This policy
        describes what data we collect, how we use it, and what controls you
        have.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Account data:</strong> email and name (handled by Insforge
          Auth for identity).
        </li>
        <li>
          <strong>Meeting content:</strong> the audio you upload (held only
          during processing, <em>not persisted</em>), generated transcripts,
          and AI summaries.
        </li>
        <li>
          <strong>Usage records:</strong> monthly transcribed minutes and
          summary counts, used for quota accounting.
        </li>
        <li>
          <strong>Payment data:</strong> handled by a third-party processor.
          We only store subscription status and billing period —{" "}
          <em>we never see your credit-card details</em>.
        </li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>Provide transcription, summarization, storage, search, and sharing</li>
        <li>Compute usage and enforce paid-plan thresholds</li>
        <li>Send service emails (welcome, quota warnings, subscription notices)</li>
        <li>Analyze anonymized usage to improve the product</li>
      </ul>

      <h2>Third-party services</h2>
      <p>
        To deliver the service, we send some data to the following providers.
        Each has its own privacy policy — please review them as needed.
      </p>
      <ul>
        <li>
          <strong>OpenAI (Whisper):</strong> audio is sent for transcription.
          OpenAI publicly commits to not training on API data.
        </li>
        <li>
          <strong>Anthropic (Claude):</strong> transcripts are sent for
          summarization. Anthropic publicly commits to not training on API
          data.
        </li>
        <li>
          <strong>Insforge Auth:</strong> account verification and profile
          management.
        </li>
        <li>
          <strong>Insforge Database:</strong> stores notes and account data.
        </li>
        <li>
          <strong>Resend:</strong> delivers system emails.
        </li>
        <li>
          <strong>Hosting infrastructure:</strong> serves the application.
        </li>
      </ul>

      <h2>Storage and deletion</h2>
      <ul>
        <li>Audio is not stored; it is discarded immediately after transcription.</li>
        <li>
          Transcripts and summaries are stored in Insforge Database and are
          isolated per user account.
        </li>
        <li>
          You can delete individual notes from the Settings page at any time,
          or email us to delete the whole account.
        </li>
        <li>
          After account deletion, we erase associated data within 30 days
          (except where retention is required by law).
        </li>
      </ul>

      <h2>Your rights</h2>
      <ul>
        <li>Access, correct, or delete your personal data</li>
        <li>Unsubscribe from emails (every email includes an unsubscribe link)</li>
        <li>Request data portability (export all notes as .md or .pdf)</li>
        <li>Object to specific processing</li>
      </ul>

      <h2>Cookies</h2>
      <p>
        We use only essential cookies (to keep your session signed in). We do
        not use tracking cookies. Any change will be reflected in this policy.
      </p>

      <h2>Minors</h2>
      <p>This service is not directed at users under 14.</p>

      <h2>Policy changes</h2>
      <p>
        Material changes will be announced by email to registered users, and
        the "Last updated" date on this page will be revised.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy or to exercise your rights, email
        <a href="mailto:hello@meetnote.ai"> hello@meetnote.ai</a>.
      </p>
    </LegalShell>
  );
}
