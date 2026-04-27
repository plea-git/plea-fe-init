import type { Meta, StoryObj } from '@storybook/react-vite';
import { LabeledField } from '../labeled-field';

const meta = {
  title: 'Components/Form/LabeledField',
  component: LabeledField,
  tags: ['autodocs'],
} satisfies Meta<typeof LabeledField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: '이름',
    children: <input className="w-full rounded border px-3 py-2" placeholder="이름을 입력하세요" />,
  },
};

export const Required: Story = {
  args: {
    label: '이메일',
    required: true,
    children: (
      <input className="w-full rounded border px-3 py-2" placeholder="이메일을 입력하세요" />
    ),
  },
};

export const WithDescription: Story = {
  args: {
    label: '비밀번호',
    required: true,
    description: '영문, 숫자, 특수문자 포함 8자 이상',
    children: (
      <input
        type="password"
        className="w-full rounded border px-3 py-2"
        placeholder="비밀번호를 입력하세요"
      />
    ),
  },
};
