import type { MeetingSummary } from "@/lib/ai/summarize";

export function NoteSummaryView({ summary }: { summary: MeetingSummary }) {
  return (
    <div className="space-y-6">
      <Section title="Summary">
        <p className="text-zinc-700 leading-relaxed">{summary.summary}</p>
      </Section>

      {summary.key_points?.length > 0 && (
        <Section title="Key points">
          <ul className="list-inside list-disc space-y-1.5 text-zinc-700">
            {summary.key_points.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </Section>
      )}

      {summary.action_items?.length > 0 && (
        <Section title="Action items">
          <div className="overflow-hidden rounded-lg border border-zinc-200">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 text-left text-xs uppercase text-zinc-500">
                <tr>
                  <th className="px-3 py-2">Owner</th>
                  <th className="px-3 py-2">Task</th>
                  <th className="px-3 py-2">Due</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {summary.action_items.map((a, i) => (
                  <tr key={i}>
                    <td className="px-3 py-2 font-medium text-zinc-900">
                      {a.owner}
                    </td>
                    <td className="px-3 py-2 text-zinc-700">{a.task}</td>
                    <td className="px-3 py-2 text-zinc-500">{a.due}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {summary.decisions?.length > 0 && (
        <Section title="Decisions">
          <ul className="list-inside list-disc space-y-1.5 text-zinc-700">
            {summary.decisions.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </Section>
      )}

      {summary.participants?.length > 0 && (
        <Section title="Participants">
          <div className="flex flex-wrap gap-1.5">
            {summary.participants.map((p, i) => (
              <span
                key={i}
                className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-700"
              >
                {p}
              </span>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-zinc-500">
        {title}
      </h2>
      {children}
    </section>
  );
}
