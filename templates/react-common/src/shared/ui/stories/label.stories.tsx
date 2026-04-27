import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from '../checkbox';
import { Label } from '../label';
import { RadioGroup, RadioGroupItem } from '../radio-group';

const meta = {
  title: 'Atoms/Label',
  component: Label,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
      description: '라벨 크기',
    },
    required: {
      control: 'boolean',
      description: '필수 표시 (*)',
    },
    type: {
      control: 'select',
      options: ['default', 'button'],
      description: '라벨 타입',
    },
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '라벨 텍스트',
  },
};

export const Small: Story = {
  args: {
    children: '작은 라벨',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    children: '큰 라벨',
    size: 'lg',
  },
};

export const Required: Story = {
  args: {
    children: '필수 입력',
    required: true,
  },
};

export const ButtonType: Story = {
  render: () => (
    <RadioGroup defaultValue="option1">
      <Label type="button">
        <RadioGroupItem value="option1" />
        버튼 스타일 라벨 (선택됨)
      </Label>
      <Label type="button">
        <RadioGroupItem value="option2" />
        버튼 스타일 라벨
      </Label>
    </RadioGroup>
  ),
};

export const WithCheckbox: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="agree" />
      <Label htmlFor="agree">이용약관에 동의합니다</Label>
    </div>
  ),
};

export const RequiredWithCheckbox: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="required-agree" />
      <Label htmlFor="required-agree" required>
        필수 동의 항목
      </Label>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Label size="sm">Small 라벨</Label>
        <span className="text-xs text-gray-400">size=sm</span>
      </div>
      <div className="flex items-center gap-4">
        <Label size="default">Default 라벨</Label>
        <span className="text-xs text-gray-400">size=default</span>
      </div>
      <div className="flex items-center gap-4">
        <Label size="lg">Large 라벨</Label>
        <span className="text-xs text-gray-400">size=lg</span>
      </div>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Label>기본 라벨</Label>
      <Label required>필수 라벨</Label>
      <Label size="sm">작은 라벨</Label>
      <Label size="lg">큰 라벨</Label>
      <RadioGroup defaultValue="btn">
        <Label type="button">
          <RadioGroupItem value="btn" />
          버튼 타입 라벨
        </Label>
      </RadioGroup>
    </div>
  ),
};
