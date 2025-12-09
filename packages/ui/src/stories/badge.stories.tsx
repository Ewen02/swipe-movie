import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../atoms/badge';

const meta: Meta<typeof Badge> = {
  title: 'Atoms/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline', 'success', 'warning'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Badge',
    variant: 'default',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary',
    variant: 'secondary',
  },
};

export const Destructive: Story = {
  args: {
    children: 'Destructive',
    variant: 'destructive',
  },
};

export const Outline: Story = {
  args: {
    children: 'Outline',
    variant: 'outline',
  },
};

export const Success: Story = {
  args: {
    children: 'Success',
    variant: 'success',
  },
};

export const Warning: Story = {
  args: {
    children: 'Warning',
    variant: 'warning',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
    </div>
  ),
};

export const SubscriptionPlans: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="outline">Free</Badge>
      <Badge variant="secondary">Starter</Badge>
      <Badge variant="default">Pro</Badge>
      <Badge variant="success">Team</Badge>
    </div>
  ),
};

export const StatusBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="success">Active</Badge>
      <Badge variant="warning">Pending</Badge>
      <Badge variant="destructive">Expired</Badge>
      <Badge variant="secondary">Canceled</Badge>
    </div>
  ),
};

export const GenreTags: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="outline">Action</Badge>
      <Badge variant="outline">Comedy</Badge>
      <Badge variant="outline">Drama</Badge>
      <Badge variant="outline">Sci-Fi</Badge>
      <Badge variant="outline">Horror</Badge>
    </div>
  ),
};
