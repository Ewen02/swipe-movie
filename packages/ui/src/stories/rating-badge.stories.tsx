import type { Meta, StoryObj } from '@storybook/react';
import { RatingBadge } from '../atoms/rating-badge';

const meta: Meta<typeof RatingBadge> = {
  title: 'Atoms/RatingBadge',
  component: RatingBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['card', 'match', 'topMatch'],
    },
    rating: {
      control: { type: 'range', min: 0, max: 10, step: 0.1 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Card: Story = {
  args: {
    rating: 8.5,
    variant: 'card',
  },
  decorators: [
    (Story) => (
      <div className="bg-gray-800 p-4 rounded">
        <Story />
      </div>
    ),
  ],
};

export const Match: Story = {
  args: {
    rating: 7.2,
    variant: 'match',
  },
};

export const TopMatch: Story = {
  args: {
    rating: 9.1,
    variant: 'topMatch',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="bg-gray-800 p-4 rounded">
        <RatingBadge rating={8.5} variant="card" />
      </div>
      <RatingBadge rating={7.2} variant="match" />
      <RatingBadge rating={9.1} variant="topMatch" />
    </div>
  ),
};
