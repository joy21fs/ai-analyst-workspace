import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function DemoDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Open dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create connector</DialogTitle>
          <DialogDescription>
            This is a basic Radix dialog wrapper used across the app.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 text-sm text-zinc-700">
          Put your form fields here.
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const meta: Meta<typeof DemoDialog> = {
  title: "UI/Dialog",
  component: DemoDialog,
};

export default meta;
type Story = StoryObj<typeof DemoDialog>;

export const Default: Story = {};

