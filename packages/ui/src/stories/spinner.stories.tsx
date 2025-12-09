import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from '../atoms/spinner';
import { Button } from '../atoms/button';

const meta: Meta<typeof Spinner> = {
  title: 'Atoms/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 'md',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  ),
};

export const InButton: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button disabled>
        <Spinner size="sm" />
        Loading...
      </Button>
      <Button variant="outline" disabled>
        <Spinner size="sm" />
        Please wait
      </Button>
    </div>
  ),
};

export const LoadingState: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-4 p-8">
      <Spinner size="lg" />
      <p className="text-muted-foreground">Loading movies...</p>
    </div>
  ),
};

export const CardLoadingState: Story = {
  render: () => (
    <div className="w-[300px] rounded-xl border bg-card p-8">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <div className="text-center">
          <p className="font-medium">Finding matches</p>
          <p className="text-sm text-muted-foreground">
            Looking for movies everyone will love...
          </p>
        </div>
      </div>
    </div>
  ),
};
