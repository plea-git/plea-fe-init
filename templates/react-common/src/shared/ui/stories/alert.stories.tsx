import type { Meta, StoryObj } from '@storybook/react-vite';
import { AlertTriangleIcon, InfoIcon } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '../alert';

const meta = {
  title: 'Atoms/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive'],
      description: '알림 스타일',
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Alert className="w-[400px]">
      <InfoIcon />
      <AlertTitle>알림</AlertTitle>
      <AlertDescription>기본 알림 메시지입니다.</AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive" className="w-[400px]">
      <AlertTriangleIcon />
      <AlertTitle>오류 발생</AlertTitle>
      <AlertDescription>문제가 발생했습니다. 다시 시도해주세요.</AlertDescription>
    </Alert>
  ),
};

export const WithoutIcon: Story = {
  render: () => (
    <Alert className="w-[400px]">
      <AlertTitle>제목만 있는 알림</AlertTitle>
      <AlertDescription>설명 텍스트입니다.</AlertDescription>
    </Alert>
  ),
};

export const TitleOnly: Story = {
  render: () => (
    <Alert className="w-[400px]">
      <InfoIcon />
      <AlertTitle>제목만 있는 알림</AlertTitle>
    </Alert>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex w-[400px] flex-col gap-4">
      <Alert>
        <InfoIcon />
        <AlertTitle>기본 알림</AlertTitle>
        <AlertDescription>기본 스타일의 알림입니다.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertTriangleIcon />
        <AlertTitle>위험 알림</AlertTitle>
        <AlertDescription>위험/오류 스타일의 알림입니다.</AlertDescription>
      </Alert>
    </div>
  ),
};
