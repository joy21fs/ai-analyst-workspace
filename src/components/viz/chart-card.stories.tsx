import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "@/components/ui/button";
import { ChartCard } from "@/components/viz/chart-card";

const meta: Meta<typeof ChartCard> = {
  title: "Viz/ChartCard",
  component: ChartCard,
  args: {
    title: "Revenue by month",
    description: "Demo container for charts and tool outputs.",
  },
};

export default meta;
type Story = StoryObj<typeof ChartCard>;

export const Default: Story = {
  args: {
    children: (
      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-600">
        Chart goes here.
      </div>
    ),
  },
};

export const WithActions: Story = {
  args: {
    actions: <Button size="sm" variant="secondary">Save</Button>,
    children: (
      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-600">
        Chart goes here.
      </div>
    ),
  },
};

