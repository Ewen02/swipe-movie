import type { Meta, StoryObj } from '@storybook/react';
import { Alert, AlertTitle, AlertDescription } from '../molecules/alert';

const meta: Meta<typeof Alert> = {
  title: 'Molecules/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Alert className="w-[400px]">
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the cli.
      </AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive" className="w-[400px]">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Your session has expired. Please log in again.
      </AlertDescription>
    </Alert>
  ),
};

export const RoomFull: Story = {
  render: () => (
    <Alert variant="destructive" className="w-[400px]">
      <AlertTitle>Room is full</AlertTitle>
      <AlertDescription>
        This room has reached its maximum number of participants. Try joining another room.
      </AlertDescription>
    </Alert>
  ),
};

export const UpgradeRequired: Story = {
  render: () => (
    <Alert className="w-[400px]">
      <AlertTitle>Upgrade to Pro</AlertTitle>
      <AlertDescription>
        You&apos;ve reached the limit of 3 rooms on the free plan. Upgrade to create more rooms.
      </AlertDescription>
    </Alert>
  ),
};

export const SwipeLimitReached: Story = {
  render: () => (
    <Alert className="w-[400px]">
      <AlertTitle>Daily limit reached</AlertTitle>
      <AlertDescription>
        You&apos;ve used all 20 swipes for today. Come back tomorrow or upgrade to Pro for unlimited swipes.
      </AlertDescription>
    </Alert>
  ),
};

export const MatchFound: Story = {
  render: () => (
    <Alert className="w-[400px] border-green-500 bg-green-50 dark:bg-green-950">
      <AlertTitle className="text-green-700 dark:text-green-300">It&apos;s a match!</AlertTitle>
      <AlertDescription className="text-green-600 dark:text-green-400">
        Everyone agreed on &quot;The Dark Knight&quot;. Time to watch!
      </AlertDescription>
    </Alert>
  ),
};
