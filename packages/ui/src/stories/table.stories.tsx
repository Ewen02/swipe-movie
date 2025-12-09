import type { Meta, StoryObj } from '@storybook/react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '../organisms/table';
import { Badge } from '../atoms/badge';

const meta: Meta<typeof Table> = {
  title: 'Organisms/Table',
  component: Table,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">INV001</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell className="text-right">$250.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">INV002</TableCell>
          <TableCell>Pending</TableCell>
          <TableCell>PayPal</TableCell>
          <TableCell className="text-right">$150.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">INV003</TableCell>
          <TableCell>Unpaid</TableCell>
          <TableCell>Bank Transfer</TableCell>
          <TableCell className="text-right">$350.00</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const RoomParticipants: Story = {
  render: () => (
    <Table>
      <TableCaption>Room participants and their progress</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Participant</TableHead>
          <TableHead>Swipes</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Joined</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">John D.</TableCell>
          <TableCell>20/20</TableCell>
          <TableCell>
            <Badge variant="success">Done</Badge>
          </TableCell>
          <TableCell className="text-right">2 hours ago</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Sarah M.</TableCell>
          <TableCell>15/20</TableCell>
          <TableCell>
            <Badge variant="secondary">Swiping</Badge>
          </TableCell>
          <TableCell className="text-right">1 hour ago</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Mike R.</TableCell>
          <TableCell>0/20</TableCell>
          <TableCell>
            <Badge variant="outline">Waiting</Badge>
          </TableCell>
          <TableCell className="text-right">30 min ago</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const MatchesTable: Story = {
  render: () => (
    <Table>
      <TableCaption>Movies everyone agreed on</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Movie</TableHead>
          <TableHead>Year</TableHead>
          <TableHead>Rating</TableHead>
          <TableHead>Genre</TableHead>
          <TableHead className="text-right">Agreement</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">The Dark Knight</TableCell>
          <TableCell>2008</TableCell>
          <TableCell>9.0</TableCell>
          <TableCell>Action, Drama</TableCell>
          <TableCell className="text-right">
            <Badge variant="success">100%</Badge>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Inception</TableCell>
          <TableCell>2010</TableCell>
          <TableCell>8.8</TableCell>
          <TableCell>Sci-Fi, Action</TableCell>
          <TableCell className="text-right">
            <Badge variant="success">100%</Badge>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Interstellar</TableCell>
          <TableCell>2014</TableCell>
          <TableCell>8.6</TableCell>
          <TableCell>Sci-Fi, Drama</TableCell>
          <TableCell className="text-right">
            <Badge variant="success">100%</Badge>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const BillingHistory: Story = {
  render: () => (
    <Table>
      <TableCaption>Your billing history</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Dec 1, 2024</TableCell>
          <TableCell className="font-medium">Pro Plan - Monthly</TableCell>
          <TableCell>
            <Badge variant="success">Paid</Badge>
          </TableCell>
          <TableCell className="text-right">$9.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Nov 1, 2024</TableCell>
          <TableCell className="font-medium">Pro Plan - Monthly</TableCell>
          <TableCell>
            <Badge variant="success">Paid</Badge>
          </TableCell>
          <TableCell className="text-right">$9.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Oct 1, 2024</TableCell>
          <TableCell className="font-medium">Pro Plan - Monthly</TableCell>
          <TableCell>
            <Badge variant="success">Paid</Badge>
          </TableCell>
          <TableCell className="text-right">$9.00</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total (Last 3 months)</TableCell>
          <TableCell className="text-right font-medium">$27.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

export const RoomsList: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Room Name</TableHead>
          <TableHead>Code</TableHead>
          <TableHead>Participants</TableHead>
          <TableHead>Matches</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">Movie Night</TableCell>
          <TableCell className="font-mono">ABC123</TableCell>
          <TableCell>4/6</TableCell>
          <TableCell>3</TableCell>
          <TableCell>
            <Badge variant="success">Active</Badge>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Weekend Watch</TableCell>
          <TableCell className="font-mono">XYZ789</TableCell>
          <TableCell>2/4</TableCell>
          <TableCell>1</TableCell>
          <TableCell>
            <Badge variant="secondary">Waiting</Badge>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Horror Fans</TableCell>
          <TableCell className="font-mono">HRR456</TableCell>
          <TableCell>6/6</TableCell>
          <TableCell>5</TableCell>
          <TableCell>
            <Badge variant="outline">Completed</Badge>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};
