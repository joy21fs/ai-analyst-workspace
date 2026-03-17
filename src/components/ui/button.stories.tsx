import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "@/components/ui/button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  args: {
    children: "Button",
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { variant: "primary" },
};

export const Secondary: Story = {
  args: { variant: "secondary" },
};

export const Ghost: Story = {
  args: { variant: "ghost" },
};

export const Danger: Story = {
  args: { variant: "danger" },
};

