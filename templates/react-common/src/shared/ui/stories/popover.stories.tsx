import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../button';
import { Input } from '../input';
import { Label } from '../label';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';

const meta = {
  title: 'Atoms/Popover',
  component: Popover,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">팝오버 열기</Button>
      </PopoverTrigger>
      <PopoverContent>
        <p>팝오버 내용입니다.</p>
      </PopoverContent>
    </Popover>
  ),
};

export const WithForm: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">설정 열기</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">크기 설정</h4>
            <p className="text-muted-foreground text-sm">요소의 크기를 설정하세요.</p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="width">너비</Label>
              <Input id="width" defaultValue="100%" className="col-span-2 h-8" />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="height">높이</Label>
              <Input id="height" defaultValue="25px" className="col-span-2 h-8" />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const AlignStart: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">왼쪽 정렬</Button>
      </PopoverTrigger>
      <PopoverContent align="start">왼쪽 정렬된 팝오버입니다.</PopoverContent>
    </Popover>
  ),
};

export const AlignEnd: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">오른쪽 정렬</Button>
      </PopoverTrigger>
      <PopoverContent align="end">오른쪽 정렬된 팝오버입니다.</PopoverContent>
    </Popover>
  ),
};

export const WithRichContent: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button>상세 정보</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-gray-100">
              <span className="text-lg">👤</span>
            </div>
            <div>
              <p className="font-medium">홍길동</p>
              <p className="text-muted-foreground text-sm">hong@example.com</p>
            </div>
          </div>
          <div className="border-t pt-3">
            <p className="text-sm text-gray-500">마지막 접속: 2024년 1월 15일</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};
