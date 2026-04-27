import type { Meta, StoryObj } from '@storybook/react-vite';
import { SelectBox } from '@/shared/components/form/SelectBox';

const meta = {
  title: 'Atoms/SelectBox',
  component: SelectBox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SelectBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    options: [
      { value: 'option1', label: '옵션 1' },
      { value: 'option2', label: '옵션 2' },
      { value: 'option3', label: '옵션 3' },
    ],
  },
  render: (args) => <SelectBox {...args} />,
};

export const Small: Story = {
  args: {
    options: [
      { value: 'option1', label: '옵션 1' },
      { value: 'option2', label: '옵션 2' },
      { value: 'option3', label: '옵션 3' },
    ],
    size: 'sm',
  },
  render: (args) => <SelectBox {...args} />,
};

export const WithGroupedOptions: Story = {
  args: {
    options: [
      {
        label: '과일',
        options: [
          { value: 'apple', label: '사과' },
          { value: 'banana', label: '바나나' },
          { value: 'orange', label: '오렌지' },
        ],
        separator: true,
      },
      {
        label: '채소',
        options: [
          { value: 'carrot', label: '당근' },
          { value: 'potato', label: '감자' },
        ],
      },
    ],
  },
  render: (args) => <SelectBox {...args} />,
};

export const MixedOptions: Story = {
  args: {
    options: [
      { value: 'all', label: '전체' },
      {
        label: '카테고리',
        options: [
          { value: 'cat1', label: '카테고리 1' },
          { value: 'cat2', label: '카테고리 2' },
        ],
      },
    ],
  },
  render: (args) => <SelectBox {...args} />,
};

export const WhiteBackground: Story = {
  args: {
    options: [
      { value: 'option1', label: '옵션 1' },
      { value: 'option2', label: '옵션 2' },
    ],
    bg: 'white',
  },
  render: (args) => <SelectBox {...args} />,
};

export const GrayBackground: Story = {
  args: {
    options: [
      { value: 'option1', label: '옵션 1' },
      { value: 'option2', label: '옵션 2' },
    ],
    bg: 'gray',
  },
  render: (args) => <SelectBox {...args} />,
};

export const Disabled: Story = {
  args: {
    options: [
      { value: 'option1', label: '옵션 1' },
      { value: 'option2', label: '옵션 2' },
    ],
    disabled: true,
  },
  render: (args) => <SelectBox {...args} />,
};

export const DisabledItem: Story = {
  args: {
    options: [
      { value: 'option1', label: '옵션 1' },
      { value: 'option5', label: '옵션 5' },
      { value: 'option2', label: '옵션 2', disabled: true },
      { value: 'option3', label: '옵션 3' },
    ],
  },
  render: (args) => <SelectBox {...args} />,
};

export const WithGroups: Story = {
  args: {
    options: [
      {
        label: '과일',
        options: [
          { value: 'apple', label: '사과' },
          { value: 'banana', label: '바나나' },
          { value: 'orange', label: '오렌지' },
        ],
      },
      {
        label: '채소',
        options: [
          { value: 'carrot', label: '당근' },
          { value: 'potato', label: '감자' },
        ],
      },
    ],
  },
  render: (args) => <SelectBox {...args} />,
};

export const WithErrorMessage: Story = {
  args: {
    options: [
      { value: 'option1', label: '옵션 1' },
      { value: 'option2', label: '옵션 2' },
    ],
    errorMessage: '필수 항목입니다',
    showErrorMessage: true,
  },
  render: (args) => <SelectBox {...args} />,
};

export const WithDefaultValue: Story = {
  args: {
    options: [
      { value: 'option1', label: '옵션 1' },
      { value: 'option2', label: '옵션 2' },
      { value: 'option3', label: '옵션 3' },
    ],
    defaultValue: 'option2',
  },
  render: (args) => <SelectBox {...args} />,
};

export const AllVariants: Story = {
  args: {
    options: [{ value: 'option1', label: '옵션 1' }],
  },
  render: (args) => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <span className="text-sm text-gray-500">Default Size</span>
        <SelectBox {...args} valueProps={{ placeholder: '기본 크기' }} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm text-gray-500">Small Size</span>
        <SelectBox {...args} valueProps={{ placeholder: '작은 크기' }} size="sm" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm text-gray-500">White Background</span>
        <SelectBox {...args} valueProps={{ placeholder: '흰색 배경' }} bg="white" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm text-gray-500">Disabled</span>
        <SelectBox {...args} valueProps={{ placeholder: '비활성화' }} disabled />
      </div>
    </div>
  ),
};
