import type { Meta, StoryObj } from '@storybook/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '../organisms/select';
import { Label } from '../atoms/label';

const meta: Meta<typeof Select> = {
  title: 'Organisms/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select option" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
        <SelectItem value="option3">Option 3</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const GenreSelect: Story = {
  render: () => (
    <div className="grid gap-2 w-[250px]">
      <Label>Genre</Label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select a genre" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="action">Action</SelectItem>
          <SelectItem value="comedy">Comedy</SelectItem>
          <SelectItem value="drama">Drama</SelectItem>
          <SelectItem value="horror">Horror</SelectItem>
          <SelectItem value="romance">Romance</SelectItem>
          <SelectItem value="scifi">Sci-Fi</SelectItem>
          <SelectItem value="thriller">Thriller</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const WithGroups: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[250px]">
        <SelectValue placeholder="Select a streaming service" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Popular</SelectLabel>
          <SelectItem value="netflix">Netflix</SelectItem>
          <SelectItem value="prime">Amazon Prime</SelectItem>
          <SelectItem value="disney">Disney+</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Others</SelectLabel>
          <SelectItem value="hbo">HBO Max</SelectItem>
          <SelectItem value="hulu">Hulu</SelectItem>
          <SelectItem value="apple">Apple TV+</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

export const RoomTypeSelect: Story = {
  render: () => (
    <div className="grid gap-2 w-[200px]">
      <Label>Room Type</Label>
      <Select defaultValue="public">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="public">Public</SelectItem>
          <SelectItem value="private">Private</SelectItem>
          <SelectItem value="friends">Friends Only</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const LanguageSelect: Story = {
  render: () => (
    <Select defaultValue="en">
      <SelectTrigger className="w-[150px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="fr">Français</SelectItem>
        <SelectItem value="es">Español</SelectItem>
        <SelectItem value="de">Deutsch</SelectItem>
      </SelectContent>
    </Select>
  ),
};
