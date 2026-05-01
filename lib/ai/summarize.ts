import Anthropic from "@anthropic-ai/sdk";
import { env } from "@/lib/env";

let client: Anthropic | null = null;
function getClient() {
  if (!client) {
    if (!env.ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY is required");
    client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
  }
  return client;
}

export interface MeetingSummary {
  title: string;
  summary: string;
  key_points: string[];
  action_items: { owner: string; task: string; due: string }[];
  decisions: string[];
  participants: string[];
}

const SUMMARY_TOOL = {
  name: "save_meeting_summary",
  description: "結構化儲存會議筆記摘要。所有欄位請以繁體中文撰寫。",
  input_schema: {
    type: "object" as const,
    properties: {
      title: {
        type: "string",
        description: "10 字內的會議主題標題",
      },
      summary: {
        type: "string",
        description: "三句話內的整體摘要",
      },
      key_points: {
        type: "array",
        items: { type: "string" },
        description: "3-7 個會議重點",
      },
      action_items: {
        type: "array",
        items: {
          type: "object",
          properties: {
            owner: { type: "string", description: "負責人，未指明寫『未指派』" },
            task: { type: "string" },
            due: { type: "string", description: "期限，未指明寫『未指定』" },
          },
          required: ["owner", "task", "due"],
        },
      },
      decisions: { type: "array", items: { type: "string" } },
      participants: { type: "array", items: { type: "string" } },
    },
    required: [
      "title",
      "summary",
      "key_points",
      "action_items",
      "decisions",
      "participants",
    ],
  },
};

export async function summarizeMeeting(transcript: string): Promise<MeetingSummary> {
  const anthropic = getClient();
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    tools: [SUMMARY_TOOL],
    tool_choice: { type: "tool", name: SUMMARY_TOOL.name },
    messages: [
      {
        role: "user",
        content: `請分析以下會議逐字稿，提取結構化摘要。\n\n逐字稿：\n${transcript}`,
      },
    ],
  });

  const toolUse = message.content.find((c) => c.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    throw new Error("Claude did not return tool_use block");
  }
  return toolUse.input as MeetingSummary;
}
