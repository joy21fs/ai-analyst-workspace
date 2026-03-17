import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

const meta: Meta<typeof EmptyState> = {
  title: "UI/EmptyState",
  component: EmptyState,
  args: {
    title: "Nothing here yet",
    description: "Create a connector or pick a dataset to get started.",
  },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {};

export const WithAction: Story = {
  args: {
    action: <Button variant="secondary">Create connector</Button>,
  },
};

