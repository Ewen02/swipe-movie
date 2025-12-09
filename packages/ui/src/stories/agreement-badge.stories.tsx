import type { Meta, StoryObj } from '@storybook/react';
import { AgreementBadge } from '../atoms/agreement-badge';

const meta: Meta<typeof AgreementBadge> = {
  title: 'Atoms/AgreementBadge',
  component: AgreementBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['small', 'large'],
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

export const Large: Story = {
  args: {
    voteCount: 4,
    totalMembers: 5,
    variant: 'large',
  },
};

export const Small: Story = {
  args: {
    voteCount: 3,
    totalMembers: 4,
    variant: 'small',
  },
};

export const FullAgreement: Story = {
  args: {
    voteCount: 5,
    totalMembers: 5,
    variant: 'large',
  },
};

export const CustomLabel: Story = {
  args: {
    voteCount: 4,
    totalMembers: 5,
    variant: 'large',
    agreementLabel: 'agreement',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-start">
      <AgreementBadge voteCount={4} totalMembers={5} variant="large" />
      <AgreementBadge voteCount={3} totalMembers={4} variant="small" />
      <AgreementBadge voteCount={5} totalMembers={5} variant="large" agreementLabel="match" />
    </div>
  ),
};
