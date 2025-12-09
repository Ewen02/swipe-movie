import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../organisms/tabs';

const meta: Meta<typeof Tabs> = {
  title: 'Organisms/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <p className="text-sm text-muted-foreground">
          Make changes to your account here.
        </p>
      </TabsContent>
      <TabsContent value="password">
        <p className="text-sm text-muted-foreground">
          Change your password here.
        </p>
      </TabsContent>
    </Tabs>
  ),
};

export const RoomTabs: Story = {
  render: () => (
    <Tabs defaultValue="swipe" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="swipe">Swipe</TabsTrigger>
        <TabsTrigger value="matches">Matches</TabsTrigger>
        <TabsTrigger value="participants">Participants</TabsTrigger>
      </TabsList>
      <TabsContent value="swipe" className="mt-4">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Swipe through movies...</p>
        </div>
      </TabsContent>
      <TabsContent value="matches" className="mt-4">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">View your matches here</p>
        </div>
      </TabsContent>
      <TabsContent value="participants" className="mt-4">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Room participants</p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

export const SettingsTabs: Story = {
  render: () => (
    <Tabs defaultValue="general" className="w-[500px]">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
        <TabsTrigger value="team">Team</TabsTrigger>
      </TabsList>
      <TabsContent value="general" className="mt-4 space-y-4">
        <h3 className="font-medium">General Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your general account settings
        </p>
      </TabsContent>
      <TabsContent value="notifications" className="mt-4 space-y-4">
        <h3 className="font-medium">Notification Preferences</h3>
        <p className="text-sm text-muted-foreground">
          Configure how you receive notifications
        </p>
      </TabsContent>
      <TabsContent value="billing" className="mt-4 space-y-4">
        <h3 className="font-medium">Billing & Plans</h3>
        <p className="text-sm text-muted-foreground">
          Manage your subscription and payment methods
        </p>
      </TabsContent>
      <TabsContent value="team" className="mt-4 space-y-4">
        <h3 className="font-medium">Team Management</h3>
        <p className="text-sm text-muted-foreground">
          Invite and manage team members
        </p>
      </TabsContent>
    </Tabs>
  ),
};
