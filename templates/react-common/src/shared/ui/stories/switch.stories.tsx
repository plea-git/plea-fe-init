import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label } from '../label';
import { Switch } from '../switch';

const meta = {
  title: 'Atoms/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
    },
    defaultChecked: {
      control: 'boolean',
      description: '기본 체크 상태',
    },
  },
} satisfies Meta<typeof Switch>;

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
    <div className="flex items-center gap-3">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">비행기 모드</Label>
    </div>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <div className="flex items-start gap-3">
      <Switch id="notifications" defaultChecked />
      <div className="flex flex-col gap-1">
        <Label htmlFor="notifications">알림 설정</Label>
        <span className="text-sm text-gray-500">새로운 메시지 알림을 받습니다</span>
      </div>
    </div>
  ),
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Switch />
        <span className="text-sm">Off</span>
      </div>
      <div className="flex items-center gap-4">
        <Switch defaultChecked />
        <span className="text-sm">On</span>
      </div>
      <div className="flex items-center gap-4">
        <Switch disabled />
        <span className="text-sm">Disabled (Off)</span>
      </div>
      <div className="flex items-center gap-4">
        <Switch disabled defaultChecked />
        <span className="text-sm">Disabled (On)</span>
      </div>
    </div>
  ),
};
