import type { Meta, StoryObj } from '@storybook/react-vite';
import { InfoIcon } from 'lucide-react';
import { Button } from '../button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip';

const meta = {
  title: 'Atoms/Tooltip',
  component: Tooltip,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">마우스를 올려보세요</Button>
      </TooltipTrigger>
      <TooltipContent>툴팁 내용입니다</TooltipContent>
    </Tooltip>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger>
        <InfoIcon className="size-5 text-gray-500" />
      </TooltipTrigger>
      <TooltipContent>추가 정보입니다</TooltipContent>
    </Tooltip>
  ),
};

export const PositionTop: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">위쪽</Button>
      </TooltipTrigger>
      <TooltipContent side="top">위쪽에 표시됩니다</TooltipContent>
    </Tooltip>
  ),
};

export const PositionBottom: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">아래쪽</Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">아래쪽에 표시됩니다</TooltipContent>
    </Tooltip>
  ),
};

export const PositionLeft: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">왼쪽</Button>
      </TooltipTrigger>
      <TooltipContent side="left">왼쪽에 표시됩니다</TooltipContent>
    </Tooltip>
  ),
};

export const PositionRight: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">오른쪽</Button>
      </TooltipTrigger>
      <TooltipContent side="right">오른쪽에 표시됩니다</TooltipContent>
    </Tooltip>
  ),
};

export const AllPositions: Story = {
  render: () => (
    <div className="flex gap-8 p-8">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm">
            Top
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Top</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm">
            Bottom
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Bottom</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm">
            Left
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">Left</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm">
            Right
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">Right</TooltipContent>
      </Tooltip>
    </div>
  ),
};
