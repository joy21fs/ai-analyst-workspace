import type { ChatMessage } from "@/domain/types";

export async function simulateStreamingText(params: {
  fullText: string;
  onDelta: (deltaText: string) => void;
  chunkSize?: number;
  delayMs?: number;
}): Promise<void> {
  const chunkSize = params.chunkSize ?? 10;
  const delayMs = params.delayMs ?? 18;

  for (let i = 0; i < params.fullText.length; i += chunkSize) {
    const chunk = params.fullText.slice(i, i + chunkSize);
    params.onDelta(chunk);
    await new Promise((r) => setTimeout(r, delayMs));
  }
}

export function newUserMessage(content: string): ChatMessage {
  return {
    id: `local_user_${crypto.randomUUID()}`,
    role: "user",
    content,
    createdAt: new Date().toISOString(),
    streamState: "complete",
  };
}

export function newAssistantMessage(): ChatMessage {
  return {
    id: `local_asst_${crypto.randomUUID()}`,
    role: "assistant",
    content: "",
    createdAt: new Date().toISOString(),
    streamState: "streaming",
    toolOutputs: [],
  };
}

