import type { Meta, StoryObj } from '@storybook/react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../organisms/accordion';

const meta: Meta<typeof Accordion> = {
  title: 'Organisms/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-[400px]">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that match the other components.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>
          Yes. It's animated by default, but you can disable it if you prefer.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const FAQ: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-[500px]">
      <AccordionItem value="item-1">
        <AccordionTrigger>What is SwipeMovie?</AccordionTrigger>
        <AccordionContent>
          SwipeMovie is a collaborative movie selection app that helps groups decide
          what to watch together by swiping on movies Tinder-style until everyone matches.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>How do I create a room?</AccordionTrigger>
        <AccordionContent>
          Click the &quot;Create Room&quot; button, give your room a name, set the number of
          participants, and share the room code with your friends.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>What happens when we match?</AccordionTrigger>
        <AccordionContent>
          When everyone in the room swipes right on the same movie, you get a match!
          The app will notify all participants and show details about where to watch.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-4">
        <AccordionTrigger>Is SwipeMovie free?</AccordionTrigger>
        <AccordionContent>
          Yes! SwipeMovie offers a free tier with basic features. Pro plans unlock
          unlimited swipes, more rooms, and advanced filtering options.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple" className="w-[400px]">
      <AccordionItem value="filters">
        <AccordionTrigger>Filters</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            <p className="text-sm">Genre: Action, Comedy</p>
            <p className="text-sm">Year: 2020-2024</p>
            <p className="text-sm">Rating: 7+</p>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="providers">
        <AccordionTrigger>Streaming Services</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            <p className="text-sm">Netflix</p>
            <p className="text-sm">Amazon Prime</p>
            <p className="text-sm">Disney+</p>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="advanced">
        <AccordionTrigger>Advanced Options</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            <p className="text-sm">Include watched movies: No</p>
            <p className="text-sm">Language: English, French</p>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const PricingDetails: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-[450px]">
      <AccordionItem value="free">
        <AccordionTrigger>
          <div className="flex justify-between w-full pr-4">
            <span>Free Plan</span>
            <span className="text-muted-foreground">$0/month</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <ul className="space-y-1 text-sm">
            <li>• 3 rooms maximum</li>
            <li>• 4 participants per room</li>
            <li>• 20 swipes per day</li>
            <li>• Basic filters</li>
          </ul>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="pro">
        <AccordionTrigger>
          <div className="flex justify-between w-full pr-4">
            <span>Pro Plan</span>
            <span className="text-muted-foreground">$9/month</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <ul className="space-y-1 text-sm">
            <li>• Unlimited rooms</li>
            <li>• 10 participants per room</li>
            <li>• Unlimited swipes</li>
            <li>• Advanced filters</li>
            <li>• Priority support</li>
          </ul>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="team">
        <AccordionTrigger>
          <div className="flex justify-between w-full pr-4">
            <span>Team Plan</span>
            <span className="text-muted-foreground">$19/month</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <ul className="space-y-1 text-sm">
            <li>• Everything in Pro</li>
            <li>• 20 participants per room</li>
            <li>• Team management</li>
            <li>• API access</li>
            <li>• Analytics dashboard</li>
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
