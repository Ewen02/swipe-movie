import type { Meta, StoryObj } from '@storybook/react';
import { Toast } from '../organisms/toast';
import { Toaster } from '../organisms/toaster';
import { useToast } from '../hooks/use-toast';
import { Button } from '../atoms/button';

const meta: Meta<typeof Toast> = {
  title: 'Organisms/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: '1',
    title: 'Default Toast',
    description: 'This is a default toast message.',
    type: 'default',
    onClose: () => {},
  },
};

export const Success: Story = {
  args: {
    id: '2',
    title: 'Success!',
    description: 'Your action was completed successfully.',
    type: 'success',
    onClose: () => {},
  },
};

export const Error: Story = {
  args: {
    id: '3',
    title: 'Error',
    description: 'Something went wrong. Please try again.',
    type: 'error',
    onClose: () => {},
  },
};

export const Warning: Story = {
  args: {
    id: '4',
    title: 'Warning',
    description: 'Please review your input before continuing.',
    type: 'warning',
    onClose: () => {},
  },
};

// Interactive demo with Toaster
const ToasterDemo = () => {
  const { toasts, toast, dismiss } = useToast();

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={() => toast({ title: 'Default', description: 'Default toast', type: 'default' })}>
        Show Default Toast
      </Button>
      <Button onClick={() => toast({ title: 'Success!', description: 'Operation completed', type: 'success' })}>
        Show Success Toast
      </Button>
      <Button onClick={() => toast({ title: 'Error', description: 'Something went wrong', type: 'error' })}>
        Show Error Toast
      </Button>
      <Button onClick={() => toast({ title: 'Warning', description: 'Be careful', type: 'warning' })}>
        Show Warning Toast
      </Button>
      <Toaster toasts={toasts} dismiss={dismiss} />
    </div>
  );
};

export const Interactive: Story = {
  render: () => <ToasterDemo />,
};

export const AllTypes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-96">
      <Toast id="1" title="Default" description="Default toast message" type="default" onClose={() => {}} />
      <Toast id="2" title="Success!" description="Success toast message" type="success" onClose={() => {}} />
      <Toast id="3" title="Error" description="Error toast message" type="error" onClose={() => {}} />
      <Toast id="4" title="Warning" description="Warning toast message" type="warning" onClose={() => {}} />
    </div>
  ),
};
