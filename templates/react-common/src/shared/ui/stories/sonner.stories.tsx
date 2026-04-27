import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../button';
import { Toaster, toast } from '../sonner';

const meta = {
  title: 'Atoms/Sonner',
  component: Toaster,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster />
      </>
    ),
  ],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Button variant="outline" onClick={() => toast('기본 토스트 메시지입니다.')}>
      토스트 표시
    </Button>
  ),
};

export const Success: Story = {
  render: () => (
    <Button variant="outline" onClick={() => toast.success('작업이 성공적으로 완료되었습니다.')}>
      성공 토스트
    </Button>
  ),
};

export const Error: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() => toast.error('오류가 발생했습니다. 다시 시도해주세요.')}
    >
      에러 토스트
    </Button>
  ),
};

export const Warning: Story = {
  render: () => (
    <Button variant="outline" onClick={() => toast.warning('주의가 필요합니다.')}>
      경고 토스트
    </Button>
  ),
};

export const Info: Story = {
  render: () => (
    <Button variant="outline" onClick={() => toast.info('새로운 업데이트가 있습니다.')}>
      정보 토스트
    </Button>
  ),
};

export const Loading: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() => {
        const toastId = toast.loading('처리 중...');
        setTimeout(() => {
          toast.success('완료되었습니다.', { id: toastId });
        }, 2000);
      }}
    >
      로딩 토스트
    </Button>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() =>
        toast('파일이 업로드되었습니다', {
          description: '파일명: document.pdf (2.5MB)',
        })
      }
    >
      설명 포함 토스트
    </Button>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() =>
        toast('메시지가 삭제되었습니다', {
          action: {
            label: '실행 취소',
            onClick: () => toast.success('삭제가 취소되었습니다'),
          },
        })
      }
    >
      액션 버튼 토스트
    </Button>
  ),
};

export const AllTypes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={() => toast('기본 메시지')}>
        기본
      </Button>
      <Button variant="outline" onClick={() => toast.success('성공!')}>
        성공
      </Button>
      <Button variant="outline" onClick={() => toast.error('에러!')}>
        에러
      </Button>
      <Button variant="outline" onClick={() => toast.warning('경고!')}>
        경고
      </Button>
      <Button variant="outline" onClick={() => toast.info('정보!')}>
        정보
      </Button>
    </div>
  ),
};
