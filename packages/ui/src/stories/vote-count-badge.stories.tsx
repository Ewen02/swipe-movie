import type { Meta, StoryObj } from '@storybook/react';
import { VoteCountBadge } from '../atoms/vote-count-badge';

const meta: Meta<typeof VoteCountBadge> = {
  title: 'Atoms/VoteCountBadge',
  component: VoteCountBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['inline', 'absolute', 'large'],
    },
    voteCount: {
      control: { type: 'number', min: 0 },
    },
    totalMembers: {
      control: { type: 'number', min: 1 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Inline: Story = {
  args: {
    voteCount: 5,
    variant: 'inline',
  },
};

export const Absolute: Story = {
  args: {
    voteCount: 3,
    variant: 'absolute',
  },
  decorators: [
    (Story) => (
      <div className="relative w-48 h-32 bg-gray-200 rounded">
        <Story />
      </div>
    ),
  ],
};

export const Large: Story = {
  args: {
    voteCount: 7,
    variant: 'large',
  },
};

export const WithPercentage: Story = {
  args: {
    voteCount: 4,
    totalMembers: 5,
    showPercentage: true,
    variant: 'inline',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-start">
      <VoteCountBadge voteCount={5} variant="inline" />
      <VoteCountBadge voteCount={7} variant="large" />
      <VoteCountBadge voteCount={4} totalMembers={5} showPercentage variant="inline" />
      <div className="relative w-48 h-32 bg-gray-200 rounded">
        <VoteCountBadge voteCount={3} variant="absolute" />
      </div>
    </div>
  ),
};
