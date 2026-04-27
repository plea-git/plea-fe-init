import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../button';
import { Dialog, DialogContent, DialogTrigger } from '../dialog';

const meta = {
  title: 'Atoms/Dialog',
  component: Dialog,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>다이얼로그 열기</Button>
      </DialogTrigger>
      <DialogContent title="다이얼로그 제목" description="다이얼로그 설명입니다.">
        <p>다이얼로그 본문 내용입니다.</p>
      </DialogContent>
    </Dialog>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>확인 다이얼로그</Button>
      </DialogTrigger>
      <DialogContent
        title="확인"
        description="이 작업을 진행하시겠습니까?"
        footer={
          <>
            <Button variant="outline">취소</Button>
            <Button>확인</Button>
          </>
        }
      >
        <p>작업을 진행하면 되돌릴 수 없습니다.</p>
      </DialogContent>
    </Dialog>
  ),
};

export const WithoutCloseButton: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>닫기 버튼 없음</Button>
      </DialogTrigger>
      <DialogContent title="닫기 버튼 없음" showCloseButton={false} footer={<Button>확인</Button>}>
        <p>닫기 버튼이 없는 다이얼로그입니다.</p>
      </DialogContent>
    </Dialog>
  ),
};

const LONG_CONTENT_PARAGRAPHS = [
  { id: 'p1', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
  { id: 'p2', text: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
  { id: 'p3', text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco.' },
  { id: 'p4', text: 'Duis aute irure dolor in reprehenderit in voluptate velit.' },
  { id: 'p5', text: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa.' },
  { id: 'p6', text: 'Curabitur pretium tincidunt lacus. Nulla gravida orci a odio.' },
  { id: 'p7', text: 'Nullam varius, turpis et commodo pharetra, est eros bibendum elit.' },
  { id: 'p8', text: 'Nulla facilisi. Cras non velit nec nisi vulputate nonummy.' },
  { id: 'p9', text: 'Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros.' },
  { id: 'p10', text: 'Pellentesque habitant morbi tristique senectus et netus et malesuada.' },
];

export const LongContent: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>긴 내용</Button>
      </DialogTrigger>
      <DialogContent title="긴 내용 다이얼로그">
        <div className="space-y-4">
          {LONG_CONTENT_PARAGRAPHS.map((item) => (
            <p key={item.id}>{item.text}</p>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  ),
};
