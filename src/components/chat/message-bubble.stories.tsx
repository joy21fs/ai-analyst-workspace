import type { Meta, StoryObj } from "@storybook/react";

import { MessageBubble } from "@/components/chat/message-bubble";

const meta: Meta<typeof MessageBubble> = {
  title: "Chat/MessageBubble",
  component: MessageBubble,
};

export default meta;
type Story = StoryObj<typeof MessageBubble>;

export const User: Story = {
  args: {
    role: "user",
    content: "Show me a bar chart of revenue by month.",
    timestamp: "10:41",
  },
};

export const Assistant: Story = {
  args: {
    role: "assistant",
    content: "Sure — here’s a bar chart grouped by month.",
    timestamp: "10:41",
  },
};

