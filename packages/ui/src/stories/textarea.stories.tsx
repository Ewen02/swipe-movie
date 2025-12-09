import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from '../atoms/textarea';
import { Label } from '../atoms/label';

const meta: Meta<typeof Textarea> = {
  title: 'Atoms/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
    },
    placeholder: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Type your message here.',
    className: 'w-[350px]',
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-[350px] gap-1.5">
      <Label htmlFor="message">Your message</Label>
      <Textarea placeholder="Type your message here." id="message" />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    placeholder: 'This textarea is disabled.',
    disabled: true,
    className: 'w-[350px]',
  },
};

export const WithText: Story = {
  render: () => (
    <div className="grid w-[350px] gap-1.5">
      <Label htmlFor="bio">Bio</Label>
      <Textarea
        placeholder="Tell us about yourself..."
        id="bio"
        defaultValue="I love watching movies with friends!"
      />
      <p className="text-sm text-muted-foreground">
        Your bio will be visible to other room participants.
      </p>
    </div>
  ),
};

export const RoomDescription: Story = {
  render: () => (
    <div className="grid w-[400px] gap-1.5">
      <Label htmlFor="description">Room Description</Label>
      <Textarea
        placeholder="Describe what kind of movies you're looking for..."
        id="description"
        className="min-h-[100px]"
      />
      <p className="text-sm text-muted-foreground">
        Help others understand what to expect in this room.
      </p>
    </div>
  ),
};

export const Feedback: Story = {
  render: () => (
    <div className="grid w-[400px] gap-1.5">
      <Label htmlFor="feedback">Feedback</Label>
      <Textarea
        placeholder="Share your thoughts about SwipeMovie..."
        id="feedback"
        className="min-h-[120px]"
      />
      <div className="flex justify-end">
        <span className="text-xs text-muted-foreground">0/500</span>
      </div>
    </div>
  ),
};
