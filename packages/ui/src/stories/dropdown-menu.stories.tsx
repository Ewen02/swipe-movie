import type { Meta, StoryObj } from '@storybook/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '../organisms/dropdown-menu';
import { Button } from '../atoms/button';

const meta: Meta<typeof DropdownMenu> = {
  title: 'Organisms/DropdownMenu',
  component: DropdownMenu,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const UserMenu: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-10 w-10 rounded-full">
          JD
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span>John Doe</span>
            <span className="text-xs font-normal text-muted-foreground">
              john@example.com
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>My Rooms</DropdownMenuItem>
        <DropdownMenuItem>My Matches</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Upgrade to Pro</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive">
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const RoomActions: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          ⋯
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Share Room</DropdownMenuItem>
        <DropdownMenuItem>Copy Link</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Edit Room</DropdownMenuItem>
        <DropdownMenuItem>Room Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive">
          Leave Room
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const WithCheckboxes: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Filter Genres</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel>Genres</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked>Action</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked>Comedy</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>Drama</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>Horror</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked>Sci-Fi</DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const WithSubmenu: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Options</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuItem>New Room</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Sort by</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Recently Added</DropdownMenuItem>
            <DropdownMenuItem>Most Popular</DropdownMenuItem>
            <DropdownMenuItem>Rating</DropdownMenuItem>
            <DropdownMenuItem>Release Date</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>View</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Grid</DropdownMenuItem>
            <DropdownMenuItem>List</DropdownMenuItem>
            <DropdownMenuItem>Compact</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Settings</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
