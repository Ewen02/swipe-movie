import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '../atoms/input';

const meta: Meta<typeof Input> = {
  title: 'Atoms/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number', 'search', 'tel', 'url'],
    },
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
    placeholder: 'Enter text...',
  },
};

export const WithValue: Story = {
  args: {
    defaultValue: 'Hello World',
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password...',
  },
};

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'email@example.com',
  },
};

export const Search: Story = {
  args: {
    type: 'search',
    placeholder: 'Search movies...',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
  },
};

export const DisabledWithValue: Story = {
  args: {
    defaultValue: 'Cannot edit this',
    disabled: true,
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <label htmlFor="email" className="text-sm font-medium">
        Email
      </label>
      <Input type="email" id="email" placeholder="email@example.com" />
    </div>
  ),
};

export const FormExample: Story = {
  render: () => (
    <form className="grid w-[350px] gap-4">
      <div className="grid gap-1.5">
        <label htmlFor="name" className="text-sm font-medium">
          Room Name
        </label>
        <Input id="name" placeholder="Movie Night" />
      </div>
      <div className="grid gap-1.5">
        <label htmlFor="code" className="text-sm font-medium">
          Invite Code
        </label>
        <Input id="code" placeholder="ABC123" />
      </div>
    </form>
  ),
};
