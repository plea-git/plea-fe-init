import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatCard } from './stat-card';

const meta = {
  title: 'Components/StatCard',
  component: StatCard,
  tags: ['autodocs'],
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    card: {
      title: '총 사용자',
      value: '1,234',
      trend: 'up',
    },
  },
};

export const WithDescription: Story = {
  args: {
    card: {
      title: '오늘 방문',
      value: 56,
      description: '어제 대비 +12%',
      trend: 'up',
    },
  },
};

export const Neutral: Story = {
  args: {
    card: {
      title: '활성 프로젝트',
      value: 8,
      trend: 'neutral',
    },
  },
};
