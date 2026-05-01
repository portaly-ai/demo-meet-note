import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "MeetNote AI · Turn meeting audio into actionable notes";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#ffffff",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* 頂部 logo bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#0f172a",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              fontWeight: 900,
            }}
          >
            M
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#0f172a",
              letterSpacing: "-0.01em",
            }}
          >
            MeetNote AI
          </div>
        </div>

        {/* 主標 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "auto",
            gap: 24,
          }}
        >
          <div
            style={{
              fontSize: 92,
              fontWeight: 900,
              color: "#0f172a",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
            }}
          >
            Turn meeting audio
            <br />
            into actionable notes
          </div>
          <div
            style={{
              fontSize: 30,
              color: "#52525b",
              lineHeight: 1.4,
            }}
          >
            Upload audio in 30 seconds. AI extracts summaries, action items, and decisions.
          </div>
        </div>

        {/* 底部小字 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 32,
            fontSize: 22,
            color: "#71717a",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              background: "#10b981",
            }}
          />
          Free to try · No credit card required
        </div>
      </div>
    ),
    { ...size },
  );
}
