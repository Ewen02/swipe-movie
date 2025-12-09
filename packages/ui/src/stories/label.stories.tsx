import type { Meta, StoryObj } from '@storybook/react';
import { Label } from '../atoms/label';
import { Input } from '../atoms/input';

const meta: Meta<typeof Label> = {
  title: 'Atoms/Label',
  component: Label,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Email',
  },
};

export const WithInput: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Email" />
    </div>
  ),
};

export const Required: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="username">
        Username <span className="text-destructive">*</span>
      </Label>
      <Input id="username" placeholder="Enter username" />
    </div>
  ),
};

export const FormExample: Story = {
  render: () => (
    <form className="grid w-[350px] gap-4">
      <div className="grid gap-1.5">
        <Label htmlFor="name">Room Name</Label>
        <Input id="name" placeholder="Movie Night" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="description">Description</Label>
        <Input id="description" placeholder="Optional description" />
      </div>
    </form>
  ),
};
