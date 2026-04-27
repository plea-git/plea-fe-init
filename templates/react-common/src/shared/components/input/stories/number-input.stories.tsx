import type { Meta, StoryObj } from '@storybook/react-vite';
import { NumberInput } from '../number-input';

const meta = {
  title: 'Components/Input/NumberInput',
  component: NumberInput,
  tags: ['autodocs'],
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: '숫자를 입력하세요',
    format: '###,###,###',
  },
};

export const PhoneNumber: Story = {
  args: {
    placeholder: '휴대폰 번호',
    format: '###-####-####',
    mask: '_',
  },
};
