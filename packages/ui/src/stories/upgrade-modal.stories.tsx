import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { UpgradeModal, type UpgradeModalTranslations } from '../organisms/upgrade-modal';
import { Button } from '../atoms/button';

const meta: Meta<typeof UpgradeModal> = {
  title: 'Organisms/UpgradeModal',
  component: UpgradeModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof UpgradeModal>;

const defaultTranslations: UpgradeModalTranslations = {
  currentPlan: 'Current Plan',
  recommended: 'Recommended',
  notNow: 'Not Now',
  viewPlans: 'View Plans',
  benefits: {
    title: 'What you get:',
  },
  features: {
    rooms: {
      title: 'Room Limit Reached',
      description: 'You have reached the limit of {limit} rooms on the free plan.',
      benefits: ['Unlimited rooms', 'More participants per room'],
    },
    participants: {
      title: 'Participant Limit Reached',
      description: 'This room has reached the limit of {limit} participants.',
      benefits: ['Unlimited participants', 'Unlimited swipes'],
    },
    swipes: {
      title: 'Swipe Limit Reached',
      description: 'You have used all {limit} swipes in this room.',
      benefits: ['Unlimited swipes', 'No expiry on rooms'],
    },
    filters: {
      title: 'Advanced Filters',
      description: 'Unlock advanced filters to find the perfect movie.',
      benefits: ['Advanced genre filters', 'Better movie matches'],
    },
  },
};

// Interactive story with a button to open the modal
const InteractiveTemplate = (args: Parameters<typeof UpgradeModal>[0]) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Upgrade Modal</Button>
      <UpgradeModal {...args} open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export const RoomsLimit: Story = {
  render: (args) => <InteractiveTemplate {...args} />,
  args: {
    feature: 'rooms',
    currentLimit: 3,
    requiredPlan: 'PRO',
    translations: defaultTranslations,
  },
};

export const ParticipantsLimit: Story = {
  render: (args) => <InteractiveTemplate {...args} />,
  args: {
    feature: 'participants',
    currentLimit: 4,
    requiredPlan: 'PRO',
    translations: defaultTranslations,
  },
};

export const SwipesLimit: Story = {
  render: (args) => <InteractiveTemplate {...args} />,
  args: {
    feature: 'swipes',
    currentLimit: 20,
    requiredPlan: 'STARTER',
    translations: defaultTranslations,
  },
};

export const FiltersLocked: Story = {
  render: (args) => <InteractiveTemplate {...args} />,
  args: {
    feature: 'filters',
    requiredPlan: 'PRO',
    translations: defaultTranslations,
  },
};

export const TeamPlan: Story = {
  render: (args) => <InteractiveTemplate {...args} />,
  args: {
    feature: 'participants',
    currentLimit: 10,
    requiredPlan: 'TEAM',
    translations: defaultTranslations,
  },
};

export const DefaultOpen: Story = {
  args: {
    open: true,
    feature: 'rooms',
    currentLimit: 3,
    requiredPlan: 'PRO',
    translations: defaultTranslations,
    onClose: () => {},
  },
};
