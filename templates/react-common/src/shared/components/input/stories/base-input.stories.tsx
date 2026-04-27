import type { Meta, StoryObj } from '@storybook/react-vite';
import { BaseInput } from '../base-input';

const meta = {
  title: 'Components/Input/BaseInput',
  component: BaseInput,
  tags: ['autodocs'],
} satisfies Meta<typeof BaseInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: '텍스트를 입력하세요',
  },
};

export const WithMaxLength: Story = {
  args: {
    placeholder: '50자 이내로 입력',
    maxLength: 50,
  },
};

export const Disabled: Story = {
  args: {
    placeholder: '수정 불가',
    disabled: true,
    value: '비활성화된 입력',
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    value: '읽기 전용 값',
  },
};
