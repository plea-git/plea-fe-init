import type { Meta, StoryObj } from '@storybook/react-vite';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '../tabs';

const meta = {
  title: 'Atoms/Tabs',
  component: Tabs,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="tab1" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="tab1">탭 1</TabsTrigger>
        <TabsTrigger value="tab2">탭 2</TabsTrigger>
        <TabsTrigger value="tab3">탭 3</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">탭 1의 내용입니다.</TabsContent>
      <TabsContent value="tab2">탭 2의 내용입니다.</TabsContent>
      <TabsContent value="tab3">탭 3의 내용입니다.</TabsContent>
    </Tabs>
  ),
};

export const TwoTabs: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="account">계정</TabsTrigger>
        <TabsTrigger value="password">비밀번호</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <p className="text-sm text-gray-500">계정 설정을 변경하세요.</p>
      </TabsContent>
      <TabsContent value="password">
        <p className="text-sm text-gray-500">비밀번호를 변경하세요.</p>
      </TabsContent>
    </Tabs>
  ),
};

export const WithDisabled: Story = {
  render: () => (
    <Tabs defaultValue="tab1" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="tab1">활성</TabsTrigger>
        <TabsTrigger value="tab2" disabled>
          비활성
        </TabsTrigger>
        <TabsTrigger value="tab3">활성</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">탭 1의 내용입니다.</TabsContent>
      <TabsContent value="tab2">탭 2의 내용입니다.</TabsContent>
      <TabsContent value="tab3">탭 3의 내용입니다.</TabsContent>
    </Tabs>
  ),
};

export const WithCardContent: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-[500px]">
      <TabsList>
        <TabsTrigger value="overview">개요</TabsTrigger>
        <TabsTrigger value="analytics">분석</TabsTrigger>
        <TabsTrigger value="reports">보고서</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="mt-4 rounded-lg border p-4">
        <h3 className="font-medium">개요</h3>
        <p className="mt-2 text-sm text-gray-500">시스템 전체 개요를 확인하세요.</p>
      </TabsContent>
      <TabsContent value="analytics" className="mt-4 rounded-lg border p-4">
        <h3 className="font-medium">분석</h3>
        <p className="mt-2 text-sm text-gray-500">상세 분석 데이터를 확인하세요.</p>
      </TabsContent>
      <TabsContent value="reports" className="mt-4 rounded-lg border p-4">
        <h3 className="font-medium">보고서</h3>
        <p className="mt-2 text-sm text-gray-500">생성된 보고서를 확인하세요.</p>
      </TabsContent>
    </Tabs>
  ),
};
