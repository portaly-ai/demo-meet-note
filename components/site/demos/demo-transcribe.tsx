"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { Mic, Pause } from "lucide-react";
import { WindowFrame } from "./window-frame";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const TRANSCRIPT =
  "Kevin: Let's review the membership demo. Anna: The signup page can be simpler; there are too many fields right now. Ryan: Payment webhook signature verification is already connected. Mei: The funnel ROI numbers are still missing; I'll finish them next week.";

const BAR_COUNT = 28;

export function DemoTranscribe() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const bars = gsap.utils.toArray<SVGRectElement>(".dt-bar");
      const text = root.current?.querySelector(".dt-text") as HTMLElement | null;
      const playhead = root.current?.querySelector(
        ".dt-playhead",
      ) as HTMLElement | null;
      const cursor = root.current?.querySelector(
        ".dt-cursor",
      ) as HTMLElement | null;
      if (!text || !playhead || !cursor) return;

      // 持續跑的音波
      bars.forEach((bar, i) => {
        gsap.to(bar, {
          attr: { height: () => 6 + Math.random() * 28 },
          y: () => 16 - (6 + Math.random() * 28) / 2,
          duration: 0.35 + Math.random() * 0.25,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.04,
        });
      });

      // 進場 + 打字主動畫（loop on scroll）
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
        repeat: -1,
        repeatDelay: 1.6,
      });

      // 重置
      tl.call(() => {
        text.textContent = "";
      })
        .set(playhead, { width: "0%" })
        .set(cursor, { autoAlpha: 1 });

      // 進度條 + 文字同步推進
      const total = TRANSCRIPT.length;
      const duration = 6;
      tl.to(playhead, { width: "100%", duration, ease: "none" }, 0);

      // 用 stepped 方式逐字加上去
      const obj = { i: 0 };
      tl.to(
        obj,
        {
          i: total,
          duration,
          ease: "none",
          onUpdate: () => {
            const n = Math.floor(obj.i);
            text.textContent = TRANSCRIPT.slice(0, n);
          },
        },
        0,
      );

      tl.to(cursor, { autoAlpha: 0, duration: 0.6 }, ">+0.4");
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <WindowFrame title="recording-2026-04-28.m4a">
        <div className="grid gap-0 md:grid-cols-2">
          {/* 左：音波 + 進度 */}
          <div className="flex flex-col justify-between gap-6 border-zinc-100 bg-zinc-50/40 p-6 md:border-r">
            <div className="flex items-center gap-3 text-[13px] text-zinc-700">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-zinc-900 text-white">
                <Mic className="h-4 w-4" />
              </span>
              <div>
                <div className="font-semibold text-zinc-900">Product weekly</div>
                <div className="text-[11px] text-zinc-500">
                  04:28 PM · 30 min
                </div>
              </div>
            </div>

            {/* 音波 */}
            <svg
              viewBox="0 0 280 32"
              className="h-10 w-full"
              preserveAspectRatio="none"
            >
              {Array.from({ length: BAR_COUNT }).map((_, i) => {
                const x = (280 / BAR_COUNT) * i + 2;
                return (
                  <rect
                    key={i}
                    className="dt-bar"
                    x={x}
                    y={12}
                    width={4}
                    height={8}
                    rx={1.5}
                    fill="#0f172a"
                  />
                );
              })}
            </svg>

            {/* 進度條 */}
            <div>
              <div className="relative h-1.5 overflow-hidden rounded-full bg-zinc-200/70">
                <div className="dt-playhead absolute inset-y-0 left-0 w-0 rounded-full bg-zinc-900" />
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500">
                <span className="inline-flex items-center gap-1">
                  <Pause className="h-3 w-3" />
                  Transcribing...
                </span>
                <span>Whisper</span>
              </div>
            </div>
          </div>

          {/* 右：逐字稿 */}
          <div className="min-h-[220px] p-6">
            <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">
              Transcript
            </div>
            <p className="mt-3 text-[14px] leading-relaxed text-zinc-800">
              <span className="dt-text" />
              <span className="dt-cursor ml-0.5 inline-block h-[1em] w-[2px] translate-y-[3px] bg-zinc-900 animate-pulse" />
            </p>
          </div>
        </div>
      </WindowFrame>
    </div>
  );
}
