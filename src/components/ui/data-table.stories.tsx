import type { Meta, StoryObj } from "@storybook/react";

import { DataTable, type ColumnDef } from "@/components/ui/data-table";

type Person = { id: string; name: string; email: string; role: string };

const rows: Person[] = [
  { id: "u_1", name: "Ava Chen", email: "ava@example.com", role: "Admin" },
  { id: "u_2", name: "Noah Kim", email: "noah@example.com", role: "Member" },
];

const columns: Array<ColumnDef<Person>> = [
  { key: "name", header: "Name", cell: (r) => r.name },
  { key: "email", header: "Email", cell: (r) => r.email },
  { key: "role", header: "Role", cell: (r) => r.role },
];

const meta: Meta<typeof DataTable<Person>> = {
  title: "UI/DataTable",
  component: DataTable<Person>,
  args: {
    columns,
    rows,
    getRowKey: (r) => r.id,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    rows: [],
  },
};

