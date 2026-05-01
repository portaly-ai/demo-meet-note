"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { Check, ListChecks, Sparkles } from "lucide-react";
import { WindowFrame } from "./window-frame";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const RAW = [
  "Kevin: The membership flow works, but the signup page still feels too heavy.",
  "Anna: I agree. Three fields are optional, so I will move them out of the main flow.",
  "Ryan: Payment is connected and webhook verification passed. Subscription sync is next.",
  "Mei: I will add the missing ROI numbers before next Wednesday.",
];

const ACTIONS = [
  { owner: "Anna", task: "Finish signup flow A/B design", due: "04/30" },
  { owner: "Ryan", task: "Connect subscription status sync", due: "05/02" },
  { owner: "Mei", task: "Fill in funnel ROI numbers", due: "05/05" },
];

export function DemoSummarize() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const lines = gsap.utils.toArray<HTMLElement>(".ds-raw-line");
      const summary = root.current?.querySelector(
        ".ds-summary",
      ) as HTMLElement | null;
      const actionsBlock = root.current?.querySelector(
        ".ds-actions",
      ) as HTMLElement | null;
      const items = gsap.utils.toArray<HTMLElement>(".ds-action");
      if (!summary || !actionsBlock || lines.length === 0) return;

      // 在 mount 當下就把右側內容隱藏，避免 trigger 前露餡
      gsap.set([summary, actionsBlock, ...items], { autoAlpha: 0 });
      gsap.set(lines, { autoAlpha: 0, y: 6 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top 70%",
          toggleActions: "play none none none",
        },
        repeat: -1,
        repeatDelay: 2,
      });

      // reset 每輪重播時的狀態
      tl.set(lines, { backgroundColor: "rgba(0,0,0,0)", autoAlpha: 0, y: 6 });
      tl.set(summary, { autoAlpha: 0, y: 8 });
      tl.set(actionsBlock, { autoAlpha: 0, y: 8 });
      tl.set(items, { autoAlpha: 0, x: 16 });

      // 1. raw lines fade in
      tl.to(lines, {
        autoAlpha: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.12,
        ease: "power2.out",
      });

      // 2. shimmer through transcript（一行一行 highlight）
      tl.to(
        lines,
        {
          backgroundColor: "rgba(16,185,129,0.10)",
          duration: 0.35,
          stagger: { each: 0.25, from: "start" },
          ease: "power1.inOut",
        },
        ">+0.3",
      );
      tl.to(lines, {
        backgroundColor: "rgba(0,0,0,0)",
        duration: 0.6,
        stagger: 0.05,
      });

      // 3. summary card 出現
      tl.to(
        summary,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        ">-0.2",
      );

      // 4. action items header + rows appear as one right-side sequence
      tl.to(
        actionsBlock,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.35,
          ease: "power2.out",
        },
        ">-0.1",
      );
      tl.to(items, {
        autoAlpha: 1,
        x: 0,
        duration: 0.4,
        stagger: 0.18,
        ease: "power2.out",
      });

      // 5. pause then loop
      tl.to({}, { duration: 1.2 });
      // reset back to start (instant)
      tl.set([summary, actionsBlock, ...items], { autoAlpha: 0 });
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <WindowFrame title="meeting-note · Claude AI">
        <div className="grid gap-0 md:grid-cols-2">
          {/* 左：原始逐字稿 */}
          <div className="border-zinc-100 p-6 md:border-r">
            <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">
              Raw transcript
            </div>
            <div className="mt-3 space-y-2">
              {RAW.map((line, i) => (
                <div
                  key={i}
                  className="ds-raw-line rounded-md px-2 py-1.5 text-[13px] leading-relaxed text-zinc-700"
                >
                  {line}
                </div>
              ))}
            </div>
          </div>

          {/* 右：結構化摘要 */}
          <div className="bg-zinc-50/40 p-6">
            <div className="ds-summary">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">
                <Sparkles className="h-3.5 w-3.5" />
                Summary
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-zinc-800">
                The membership demo is viable. This week focuses on simplifying signup, syncing subscriptions, and completing funnel ROI data.
              </p>
            </div>

            <div className="ds-actions mt-5">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">
                <ListChecks className="h-3.5 w-3.5" />
                Action items
              </div>
              <ul className="mt-3 space-y-2">
                {ACTIONS.map((a, i) => (
                  <li
                    key={i}
                    className="ds-action flex items-start gap-3 rounded-lg border border-zinc-100 bg-white px-3 py-2.5"
                  >
                    <span className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full bg-emerald-50 text-emerald-700">
                      <Check className="h-3 w-3" />
                    </span>
                    <div className="min-w-0 flex-1 text-[13px]">
                      <span className="font-semibold text-zinc-900">
                        {a.owner}
                      </span>
                      <span className="ml-2 text-zinc-700">{a.task}</span>
                    </div>
                    <span className="flex-none whitespace-nowrap text-[11px] text-zinc-400">
                      {a.due}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </WindowFrame>
    </div>
  );
}
