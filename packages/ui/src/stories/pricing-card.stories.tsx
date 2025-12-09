import type { Meta, StoryObj } from '@storybook/react';
import { PricingCard } from '../organisms/pricing-card';

const meta: Meta<typeof PricingCard> = {
  title: 'Organisms/PricingCard',
  component: PricingCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    billingPeriod: {
      control: 'radio',
      options: ['monthly', 'annual'],
    },
    highlighted: {
      control: 'boolean',
    },
    isLoading: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof PricingCard>;

const freeFeatures = [
  { text: '3 rooms maximum', included: true },
  { text: '4 participants per room', included: true },
  { text: '20 swipes per room', included: true },
  { text: 'Basic filters', included: true },
  { text: 'Unlimited rooms', included: false },
  { text: 'Advanced filters', included: false },
];

const proFeatures = [
  { text: 'Unlimited rooms', included: true },
  { text: '10 participants per room', included: true },
  { text: 'Unlimited swipes', included: true },
  { text: 'Advanced filters', included: true },
  { text: 'Priority support', included: true },
  { text: 'Team features', included: false },
];

const teamFeatures = [
  { text: 'Unlimited rooms', included: true },
  { text: 'Unlimited participants', included: true },
  { text: 'Unlimited swipes', included: true },
  { text: 'All filters', included: true },
  { text: 'Priority support', included: true },
  { text: 'Team management', included: true },
];

export const Free: Story = {
  args: {
    name: 'FREE',
    price: 0,
    period: 'month',
    description: 'Perfect for trying out Swipe Movie',
    features: freeFeatures,
    cta: 'Get Started',
    highlighted: false,
    index: 0,
  },
};

export const ProMonthly: Story = {
  args: {
    name: 'PRO',
    price: 9.99,
    period: 'month',
    description: 'Best for movie enthusiasts',
    features: proFeatures,
    cta: 'Subscribe Now',
    highlighted: true,
    badge: 'Most Popular',
    billingPeriod: 'monthly',
    monthlyPrice: 9.99,
    annualPrice: 99.99,
    index: 1,
  },
};

export const ProAnnual: Story = {
  args: {
    name: 'PRO',
    price: 8.33,
    period: 'month',
    description: 'Best for movie enthusiasts',
    features: proFeatures,
    cta: 'Subscribe Now',
    highlighted: true,
    badge: 'Most Popular',
    billingPeriod: 'annual',
    monthlyPrice: 9.99,
    annualPrice: 99.99,
    index: 1,
  },
};

export const Team: Story = {
  args: {
    name: 'TEAM',
    price: 19.99,
    period: 'month',
    description: 'For groups and organizations',
    features: teamFeatures,
    cta: 'Contact Sales',
    highlighted: false,
    index: 2,
  },
};

export const Loading: Story = {
  args: {
    ...ProMonthly.args,
    isLoading: true,
  },
};

export const AllCards: Story = {
  render: () => (
    <div className="flex gap-6 items-stretch">
      <div className="w-80">
        <PricingCard
          name="FREE"
          price={0}
          period="month"
          description="Perfect for trying out Swipe Movie"
          features={freeFeatures}
          cta="Get Started"
          index={0}
        />
      </div>
      <div className="w-80">
        <PricingCard
          name="PRO"
          price={9.99}
          period="month"
          description="Best for movie enthusiasts"
          features={proFeatures}
          cta="Subscribe Now"
          highlighted
          badge="Most Popular"
          billingPeriod="monthly"
          monthlyPrice={9.99}
          annualPrice={99.99}
          index={1}
        />
      </div>
      <div className="w-80">
        <PricingCard
          name="TEAM"
          price={19.99}
          period="month"
          description="For groups and organizations"
          features={teamFeatures}
          cta="Contact Sales"
          index={2}
        />
      </div>
    </div>
  ),
};
