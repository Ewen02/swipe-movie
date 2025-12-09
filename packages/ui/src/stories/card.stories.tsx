import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../organisms/card';
import { Button } from '../atoms/button';

const meta: Meta<typeof Card> = {
  title: 'Organisms/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content can contain any elements.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),
};

export const Simple: Story = {
  render: () => (
    <Card className="w-[350px] p-6">
      <p>A simple card with just content.</p>
    </Card>
  ),
};

export const WithImage: Story = {
  render: () => (
    <Card className="w-[350px] overflow-hidden">
      <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5" />
      <CardHeader>
        <CardTitle>Featured Content</CardTitle>
        <CardDescription>A card with an image placeholder.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          This card demonstrates how images can be integrated.
        </p>
      </CardContent>
    </Card>
  ),
};

export const MovieCard: Story = {
  render: () => (
    <Card className="w-[300px] overflow-hidden">
      <div className="relative h-[400px] bg-gradient-to-br from-purple-500/30 to-pink-500/30">
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <h3 className="text-lg font-bold text-white">Movie Title</h3>
          <p className="text-sm text-gray-300">2024 • Action, Drama</p>
        </div>
      </div>
      <CardContent className="pt-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          A brief synopsis of the movie that gives viewers an idea of what to expect...
        </p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="destructive" size="sm">Skip</Button>
        <Button variant="default" size="sm" className="flex-1">Like</Button>
      </CardFooter>
    </Card>
  ),
};

export const PricingCard: Story = {
  render: () => (
    <Card className="w-[300px]">
      <CardHeader>
        <CardTitle>Pro Plan</CardTitle>
        <CardDescription>Best for teams</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">$19<span className="text-sm font-normal text-muted-foreground">/month</span></div>
        <ul className="mt-4 space-y-2 text-sm">
          <li>✓ Unlimited rooms</li>
          <li>✓ 20 participants per room</li>
          <li>✓ Advanced filters</li>
          <li>✓ Priority support</li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Subscribe</Button>
      </CardFooter>
    </Card>
  ),
};
