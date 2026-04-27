import type { Meta, StoryObj } from '@storybook/react-vite';

import { Checkbox } from '../checkbox';
import { Label } from '../label';

const meta = {
  title: 'Atoms/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '체크박스 크기',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
    },
    checked: {
      control: 'boolean',
      description: '체크 상태',
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">이용약관에 동의합니다</Label>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <Checkbox size="sm" defaultChecked />
        <span className="text-xs text-gray-500">SM</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Checkbox size="md" defaultChecked />
        <span className="text-xs text-gray-500">MD</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Checkbox size="lg" defaultChecked />
        <span className="text-xs text-gray-500">LG</span>
      </div>
    </div>
  ),
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Checkbox />
        <span className="text-sm">Unchecked</span>
      </div>
      <div className="flex items-center gap-4">
        <Checkbox defaultChecked />
        <span className="text-sm">Checked</span>
      </div>
      <div className="flex items-center gap-4">
        <Checkbox disabled />
        <span className="text-sm">Disabled</span>
      </div>
      <div className="flex items-center gap-4">
        <Checkbox disabled defaultChecked />
        <span className="text-sm">Disabled + Checked</span>
      </div>
    </div>
  ),
};
