"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Tab = "audio" | "transcript";

export function NewNoteClient() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("audio");
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAudio(file: File) {
    setError(null);
    setBusy(true);
    try {
      setStep("Uploading audio...");
      const fd = new FormData();
      fd.append("file", file);
      const trRes = await fetch("/api/transcribe", { method: "POST", body: fd });
      if (!trRes.ok) throw new Error((await trRes.json()).error || "Transcription failed");
      const tr = (await trRes.json()) as {
        transcript: string;
        durationSeconds: number;
      };

      setStep("Generating summary...");
      const sumRes = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "audio",
          transcript: tr.transcript,
          durationSeconds: tr.durationSeconds,
        }),
      });
      if (!sumRes.ok) throw new Error((await sumRes.json()).error || "Summarization failed");
      const { id } = (await sumRes.json()) as { id: string };
      router.push(`/notes/${id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setBusy(false);
      setStep(null);
    }
  }

  async function handleTranscript(transcript: string) {
    setError(null);
    setBusy(true);
    try {
      setStep("Generating summary...");
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "transcript",
          transcript,
          durationSeconds: 0,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Summarization failed");
      const { id } = (await res.json()) as { id: string };
      router.push(`/notes/${id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setBusy(false);
      setStep(null);
    }
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white">
      <div className="flex border-b border-zinc-200">
        <TabButton active={tab === "audio"} onClick={() => setTab("audio")}>
          Upload audio
        </TabButton>
        <TabButton
          active={tab === "transcript"}
          onClick={() => setTab("transcript")}
        >
          Paste transcript
        </TabButton>
      </div>

      <div className="p-6">
        {tab === "audio" && (
          <AudioForm busy={busy} step={step} onSubmit={handleAudio} />
        )}
        {tab === "transcript" && (
          <TranscriptForm busy={busy} step={step} onSubmit={handleTranscript} />
        )}
        {error && (
          <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 px-4 py-3 text-sm font-medium ${
        active
          ? "border-b-2 border-zinc-900 text-zinc-900"
          : "text-zinc-500 hover:text-zinc-700"
      }`}
    >
      {children}
    </button>
  );
}

function AudioForm({
  busy,
  step,
  onSubmit,
}: {
  busy: boolean;
  step: string | null;
  onSubmit: (file: File) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (file) onSubmit(file);
      }}
    >
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 px-6 py-12 text-center hover:border-zinc-400">
        <span className="text-sm font-medium text-zinc-700">
          {file ? file.name : "Choose an audio file (.mp3 / .m4a / .wav, <25MB)"}
        </span>
        <span className="mt-1 text-xs text-zinc-500">
          Transcribed automatically by OpenAI Whisper
        </span>
        <input
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </label>
      <button
        type="submit"
        disabled={!file || busy}
        className="mt-4 w-full rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50"
      >
        {busy ? step ?? "Working..." : "Transcribe and summarize"}
      </button>
    </form>
  );
}

function TranscriptForm({
  busy,
  step,
  onSubmit,
}: {
  busy: boolean;
  step: string | null;
  onSubmit: (text: string) => void;
}) {
  const [text, setText] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (text.trim()) onSubmit(text);
      }}
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your meeting transcript... (Google Meet, Zoom, Teams all work)"
        rows={12}
        className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
      />
      <button
        type="submit"
        disabled={!text.trim() || busy}
        className="mt-4 w-full rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50"
      >
        {busy ? step ?? "Working..." : "Summarize with AI"}
      </button>
    </form>
  );
}
