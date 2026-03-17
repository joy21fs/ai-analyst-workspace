import { describe, expect, it } from "vitest";

import { simulateStreamingText } from "@/features/chat/streaming";

describe("simulateStreamingText", () => {
  it("emits deltas until full text is delivered", async () => {
    const full = "hello streaming world";
    let out = "";

    await simulateStreamingText({
      fullText: full,
      chunkSize: 5,
      delayMs: 0,
      onDelta: (d) => {
        out += d;
      },
    });

    expect(out).toBe(full);
  });
});

