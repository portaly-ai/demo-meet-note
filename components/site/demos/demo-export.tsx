"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { Check, Copy, FileText, MousePointer2 } from "lucide-react";
import { WindowFrame } from "./window-frame";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function DemoExport() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cursor = root.current?.querySelector(
        ".de-cursor",
      ) as HTMLElement | null;
      const btnCopy = root.current?.querySelector(
        ".de-btn-copy",
      ) as HTMLElement | null;
      const btnMd = root.current?.querySelector(
        ".de-btn-md",
      ) as HTMLElement | null;
      const btnPdf = root.current?.querySelector(
        ".de-btn-pdf",
      ) as HTMLElement | null;
      const toastCopy = root.current?.querySelector(
        ".de-toast-copy",
      ) as HTMLElement | null;
      const fileMd = root.current?.querySelector(
        ".de-file-md",
      ) as HTMLElement | null;
      const filePdf = root.current?.querySelector(
        ".de-file-pdf",
      ) as HTMLElement | null;
      if (!cursor || !btnCopy || !btnMd || !btnPdf) return;

      // 算出 target 相對於 cursor 的 offsetParent 的座標。
      // 在 timeline 執行當下才量（用 function-based value），
      // 避免 mount 時量到的座標被字體/圖載入後 layout shift 弄歪。
      const offsetTo = (target: HTMLElement) => {
        const parent = (cursor.offsetParent ??
          root.current!) as HTMLElement;
        const t = target.getBoundingClientRect();
        const p = parent.getBoundingClientRect();
        return {
          x: t.left + t.width / 2 - p.left - 8,
          y: t.top + t.height / 2 - p.top - 8,
        };
      };

      const moveTo = (
        tl: gsap.core.Timeline,
        target: HTMLElement,
        duration = 0.7,
      ) => {
        tl.to(cursor, {
          x: () => offsetTo(target).x,
          y: () => offsetTo(target).y,
          duration,
          ease: "power3.inOut",
        });
      };

      // 按鈕點擊效果：壓下（scale + 變灰）+ ring 擴散 + Q 彈回。
      // 比單純 scale 0.96 更顯眼，符合「真的有被點到」的回饋感。
      const click = (tl: gsap.core.Timeline, target: HTMLElement) => {
        // 壓下
        tl.to(target, {
          scale: 0.94,
          backgroundColor: "#f4f4f5", // zinc-100
          borderColor: "#d4d4d8", // zinc-300
          duration: 0.09,
          ease: "power2.in",
        });
        // 同步送出 ring 擴散
        tl.fromTo(
          target,
          { boxShadow: "0 0 0 0 rgba(15,23,42,0.22)" },
          {
            boxShadow: "0 0 0 12px rgba(15,23,42,0)",
            duration: 0.55,
            ease: "power2.out",
          },
          "<",
        );
        // 彈回原狀
        tl.to(
          target,
          {
            scale: 1,
            backgroundColor: "#ffffff",
            borderColor: "#e4e4e7", // zinc-200
            duration: 0.24,
            ease: "back.out(1.8)",
          },
          "<+0.06",
        );
      };

      // mount 當下就先把所有浮層藏起來、按鈕重置原狀
      gsap.set([toastCopy, fileMd, filePdf], { autoAlpha: 0 });
      gsap.set(cursor, { autoAlpha: 0 });
      gsap.set([btnCopy, btnMd, btnPdf], {
        scale: 1,
        backgroundColor: "#ffffff",
        borderColor: "#e4e4e7",
        boxShadow: "0 0 0 0 rgba(15,23,42,0)",
        transformOrigin: "center center",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top 70%",
          toggleActions: "play none none none",
        },
        repeat: -1,
        repeatDelay: 0.8,
      });

      // 起始：cursor 在左上（用 offsetParent 計算的相對座標）
      tl.set(cursor, {
        x: () => offsetTo(btnCopy).x - 80,
        y: () => offsetTo(btnCopy).y - 60,
        autoAlpha: 1,
      });
      tl.set([toastCopy, fileMd, filePdf], { autoAlpha: 0 });

      // === Copy ===
      moveTo(tl, btnCopy);
      click(tl, btnCopy);
      tl.to(toastCopy, { autoAlpha: 1, y: 0, duration: 0.3 }, "<+0.1").fromTo(
        toastCopy,
        { y: 8 },
        { y: 0, duration: 0.3 },
        "<",
      );
      tl.to({}, { duration: 0.9 });
      tl.to(toastCopy, { autoAlpha: 0, y: -6, duration: 0.3 });

      // === Markdown ===
      moveTo(tl, btnMd);
      click(tl, btnMd);
      tl.fromTo(
        fileMd,
        { y: -10, autoAlpha: 0 },
        {
          y: 30,
          autoAlpha: 1,
          duration: 0.5,
          ease: "power2.out",
        },
        "<+0.05",
      );
      tl.to(fileMd, { autoAlpha: 0, y: 60, duration: 0.4 });

      // === PDF ===
      moveTo(tl, btnPdf);
      click(tl, btnPdf);
      tl.fromTo(
        filePdf,
        { y: -10, autoAlpha: 0 },
        {
          y: 30,
          autoAlpha: 1,
          duration: 0.5,
          ease: "power2.out",
        },
        "<+0.05",
      );
      tl.to(filePdf, { autoAlpha: 0, y: 60, duration: 0.4 });

      // pause
      tl.to({}, { duration: 0.5 });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative">
      <WindowFrame title="Product weekly · 04/28">
        <div className="relative p-6 md:p-8">
          {/* 模擬筆記內容 */}
          <h3 className="text-[16px] font-bold text-zinc-900">Product weekly</h3>
          <p className="mt-2 text-[13px] leading-relaxed text-zinc-700">
            The membership demo is viable. This week focuses on simplifying signup, syncing subscriptions, and completing funnel ROI data.
          </p>
          <div className="mt-5 space-y-2">
            <FakeRow text="Finish signup flow A/B design" who="Anna" />
            <FakeRow text="Connect subscription status sync" who="Ryan" />
            <FakeRow text="Fill in funnel ROI numbers" who="Mei" />
          </div>

          {/* 三個按鈕 */}
          <div className="mt-7 flex flex-wrap gap-2">
            <ActionBtn className="de-btn-copy" icon={<Copy className="h-3.5 w-3.5" />}>
              Copy
            </ActionBtn>
            <ActionBtn className="de-btn-md" icon={<FileText className="h-3.5 w-3.5" />}>
              Download Markdown
            </ActionBtn>
            <ActionBtn className="de-btn-pdf" icon={<FileText className="h-3.5 w-3.5" />}>
              Download PDF
            </ActionBtn>
          </div>

          {/* Floating UI: cursor */}
          <span
            aria-hidden
            className="de-cursor pointer-events-none absolute left-0 top-0 z-20 text-zinc-900"
          >
            <MousePointer2 className="h-4 w-4 fill-white drop-shadow-sm" />
          </span>

          {/* Toast：複製成功 */}
          <span
            aria-hidden
            className="de-toast-copy pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 rounded-md bg-zinc-900 px-3 py-1.5 text-[12px] font-medium text-white shadow-lg"
          >
            <Check className="mr-1 inline h-3 w-3" />
            Copied to clipboard
          </span>

          {/* 模擬下載：兩個檔案 chip */}
          <span
            aria-hidden
            className="de-file-md pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-[12px] text-zinc-700 shadow-md"
          >
            <FileText className="h-3.5 w-3.5 text-zinc-500" />
            meeting-2026-04-28.md
          </span>
          <span
            aria-hidden
            className="de-file-pdf pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-[12px] text-zinc-700 shadow-md"
          >
            <FileText className="h-3.5 w-3.5 text-rose-500" />
            meeting-2026-04-28.pdf
          </span>
        </div>
      </WindowFrame>
    </div>
  );
}

function FakeRow({ text, who }: { text: string; who: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-zinc-100 bg-white px-3 py-2 text-[13px]">
      <div className="flex items-center gap-2 text-zinc-700">
        <Check className="h-3.5 w-3.5 text-emerald-600" />
        {text}
      </div>
      <span className="text-[11px] text-zinc-400">{who}</span>
    </div>
  );
}

function ActionBtn({
  icon,
  children,
  className,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={`inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[12px] font-medium text-zinc-800 transition hover:border-zinc-300 ${
        className ?? ""
      }`}
    >
      {icon}
      {children}
    </button>
  );
}
