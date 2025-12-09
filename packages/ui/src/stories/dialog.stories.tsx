import type { Meta, StoryObj } from '@storybook/react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '../organisms/dialog';
import { Button } from '../atoms/button';
import { Input } from '../atoms/input';
import { Label } from '../atoms/label';

const meta: Meta<typeof Dialog> = {
  title: 'Organisms/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>
            This is a description of the dialog content.
          </DialogDescription>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Dialog content goes here.
        </p>
      </DialogContent>
    </Dialog>
  ),
};

export const CreateRoom: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Room</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new room</DialogTitle>
          <DialogDescription>
            Create a room to start swiping movies with friends.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Room name</Label>
            <Input id="name" placeholder="Movie Night" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="participants">Max participants</Label>
            <Input id="participants" type="number" defaultValue="4" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Create Room</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const JoinRoom: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Join Room</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[350px]">
        <DialogHeader>
          <DialogTitle>Join a room</DialogTitle>
          <DialogDescription>
            Enter the room code to join your friends.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="code">Room code</Label>
            <Input id="code" placeholder="ABC123" className="uppercase" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" className="w-full">Join</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const ShareRoom: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Share Room</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Share this room</DialogTitle>
          <DialogDescription>
            Invite friends to join your movie room.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-2">
            <Input
              readOnly
              value="https://swipemovie.com/room/ABC123"
              className="flex-1"
            />
            <Button variant="outline" size="sm">Copy</Button>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Room Code</p>
            <p className="text-2xl font-mono font-bold">ABC123</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  ),
};
