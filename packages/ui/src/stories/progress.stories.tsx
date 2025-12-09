import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from '../molecules/progress';

const meta: Meta<typeof Progress> = {
  title: 'Molecules/Progress',
  component: Progress,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 60,
    className: 'w-[300px]',
  },
};

export const Empty: Story = {
  args: {
    value: 0,
    className: 'w-[300px]',
  },
};

export const Half: Story = {
  args: {
    value: 50,
    className: 'w-[300px]',
  },
};

export const Complete: Story = {
  args: {
    value: 100,
    className: 'w-[300px]',
  },
};

export const SwipeProgress: Story = {
  render: () => (
    <div className="w-[300px] space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Swipes</span>
          <span>15/20</span>
        </div>
        <Progress value={75} />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Matches</span>
          <span>8/15</span>
        </div>
        <Progress value={53} />
      </div>
    </div>
  ),
};

export const RoomCompletion: Story = {
  render: () => (
    <div className="w-[350px] rounded-lg border p-4 space-y-3">
      <div className="flex justify-between items-center">
        <span className="font-medium">Room Progress</span>
        <span className="text-sm text-muted-foreground">4/6 participants done</span>
      </div>
      <Progress value={67} />
      <p className="text-sm text-muted-foreground">
        Waiting for 2 more participants to finish swiping...
      </p>
    </div>
  ),
};
