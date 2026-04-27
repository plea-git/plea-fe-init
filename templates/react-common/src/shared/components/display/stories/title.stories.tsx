import type { Meta, StoryObj } from '@storybook/react-vite';
import { Title } from '../title';

const meta = {
  title: 'Components/Display/Title',
  component: Title,
  tags: ['autodocs'],
} satisfies Meta<typeof Title>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Large: Story = {
  args: {
    size: 'lg',
    children: '페이지 제목 (lg)',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: '서브 제목 (sm)',
  },
};

export const Default: Story = {
  args: {
    children: '기본 제목',
  },
};
