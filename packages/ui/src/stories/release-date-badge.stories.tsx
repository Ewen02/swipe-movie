import type { Meta, StoryObj } from '@storybook/react';
import { ReleaseDateBadge } from '../atoms/release-date-badge';

const meta: Meta<typeof ReleaseDateBadge> = {
  title: 'Atoms/ReleaseDateBadge',
  component: ReleaseDateBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['card', 'info'],
    },
    releaseDate: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Card: Story = {
  args: {
    releaseDate: '2024-03-15',
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

export const Info: Story = {
  args: {
    releaseDate: '2023-11-20',
    variant: 'info',
  },
};

export const OldMovie: Story = {
  args: {
    releaseDate: '1994-09-23',
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

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="bg-gray-800 p-4 rounded">
        <ReleaseDateBadge releaseDate="2024-03-15" variant="card" />
      </div>
      <ReleaseDateBadge releaseDate="2023-11-20" variant="info" />
    </div>
  ),
};
