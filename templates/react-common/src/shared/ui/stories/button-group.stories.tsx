import type { Meta, StoryObj } from '@storybook/react-vite';
import { Download, Plus, Search, Upload } from 'lucide-react';
import { Button } from '../button';
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from '../button-group';
import { Input } from '../input';

const meta = {
  title: 'Atoms/ButtonGroup',
  component: ButtonGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: '버튼 그룹 방향',
    },
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    orientation: 'horizontal',
    children: (
      <>
        <Button variant="outline">첫 번째</Button>
        <Button variant="outline">두 번째</Button>
        <Button variant="outline">세 번째</Button>
      </>
    ),
  },
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    children: (
      <>
        <Button variant="outline">상단</Button>
        <Button variant="outline">중간</Button>
        <Button variant="outline">하단</Button>
      </>
    ),
  },
};

export const WithSeparator: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="outline">다운로드</Button>
      <ButtonGroupSeparator />
      <Button variant="outline">업로드</Button>
      <ButtonGroupSeparator />
      <Button variant="outline">공유</Button>
    </ButtonGroup>
  ),
};

export const WithSeparatorVertical: Story = {
  render: () => (
    <ButtonGroup orientation="vertical">
      <Button variant="outline">첫 번째</Button>
      <ButtonGroupSeparator orientation="horizontal" />
      <Button variant="outline">두 번째</Button>
      <ButtonGroupSeparator orientation="horizontal" />
      <Button variant="outline">세 번째</Button>
    </ButtonGroup>
  ),
};

export const WithText: Story = {
  render: () => (
    <ButtonGroup>
      <ButtonGroupText>페이지</ButtonGroupText>
      <Button variant="outline">이전</Button>
      <Button variant="outline">다음</Button>
    </ButtonGroup>
  ),
};

export const WithTextAndIcon: Story = {
  render: () => (
    <ButtonGroup>
      <ButtonGroupText>
        <Search className="size-4" />
        검색 옵션
      </ButtonGroupText>
      <Button variant="outline">전체</Button>
      <Button variant="outline">제목</Button>
      <Button variant="outline">내용</Button>
    </ButtonGroup>
  ),
};

export const WithInput: Story = {
  render: () => (
    <ButtonGroup>
      <Input placeholder="검색어 입력" className="w-[200px]" />
      <Button variant="outline">
        <Search className="size-4" />
        검색
      </Button>
    </ButtonGroup>
  ),
};

export const WithInputAndMultipleButtons: Story = {
  render: () => (
    <ButtonGroup>
      <Input placeholder="검색어 입력" className="w-[300px]" />
      <Button variant="outline">
        <Search className="size-4" />
      </Button>
      <Button variant="outline">
        <Plus className="size-4" />
      </Button>
    </ButtonGroup>
  ),
};

export const IconButtons: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="outline" size="icon">
        <Download className="size-4" />
      </Button>
      <Button variant="outline" size="icon">
        <Upload className="size-4" />
      </Button>
      <Button variant="outline" size="icon">
        <Plus className="size-4" />
      </Button>
    </ButtonGroup>
  ),
};

export const IconButtonsVertical: Story = {
  render: () => (
    <ButtonGroup orientation="vertical">
      <Button variant="outline" size="icon">
        <Download className="size-4" />
      </Button>
      <Button variant="outline" size="icon">
        <Upload className="size-4" />
      </Button>
      <Button variant="outline" size="icon">
        <Plus className="size-4" />
      </Button>
    </ButtonGroup>
  ),
};

export const DifferentVariants: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="default">저장</Button>
      <Button variant="outline">취소</Button>
      <Button variant="destructive">삭제</Button>
    </ButtonGroup>
  ),
};

export const WithActiveState: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="default">활성</Button>
      <Button variant="outline">선택 안됨</Button>
      <Button variant="outline">선택 안됨</Button>
    </ButtonGroup>
  ),
};

export const ComplexExample: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <ButtonGroup>
        <ButtonGroupText>정렬</ButtonGroupText>
        <Button variant="outline">이름</Button>
        <Button variant="outline">날짜</Button>
        <Button variant="outline">크기</Button>
      </ButtonGroup>
      <ButtonGroup>
        <Input placeholder="파일명 검색" className="w-[250px]" />
        <ButtonGroupSeparator />
        <Button variant="outline">
          <Search className="size-4" />
        </Button>
        <ButtonGroupSeparator />
        <Button variant="outline">
          <Download className="size-4" />
        </Button>
      </ButtonGroup>
    </div>
  ),
};

export const AllOrientations: Story = {
  render: () => (
    <div className="flex gap-8">
      <div className="flex flex-col gap-2">
        <span className="text-sm text-gray-500">Horizontal</span>
        <ButtonGroup>
          <Button variant="outline">첫 번째</Button>
          <Button variant="outline">두 번째</Button>
          <Button variant="outline">세 번째</Button>
        </ButtonGroup>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm text-gray-500">Vertical</span>
        <ButtonGroup orientation="vertical">
          <Button variant="outline">첫 번째</Button>
          <Button variant="outline">두 번째</Button>
          <Button variant="outline">세 번째</Button>
        </ButtonGroup>
      </div>
    </div>
  ),
};
