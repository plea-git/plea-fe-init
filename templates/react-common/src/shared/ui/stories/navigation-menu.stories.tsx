import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '../navigation-menu';

const meta = {
  title: 'Atoms/NavigationMenu',
  component: NavigationMenu,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NavigationMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>서비스</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[400px] gap-3 p-4">
              <NavigationMenuLink href="#">
                <div className="font-medium">메시지 발송</div>
                <p className="text-muted-foreground text-sm">SMS, MMS 메시지를 발송합니다.</p>
              </NavigationMenuLink>
              <NavigationMenuLink href="#">
                <div className="font-medium">발송 이력</div>
                <p className="text-muted-foreground text-sm">발송된 메시지 이력을 확인합니다.</p>
              </NavigationMenuLink>
              <NavigationMenuLink href="#">
                <div className="font-medium">통계</div>
                <p className="text-muted-foreground text-sm">발송 통계를 확인합니다.</p>
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>관리</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[400px] gap-3 p-4">
              <NavigationMenuLink href="#">
                <div className="font-medium">사용자 관리</div>
                <p className="text-muted-foreground text-sm">사용자 목록을 관리합니다.</p>
              </NavigationMenuLink>
              <NavigationMenuLink href="#">
                <div className="font-medium">수신자 관리</div>
                <p className="text-muted-foreground text-sm">수신자 그룹을 관리합니다.</p>
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>설정</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[300px] gap-3 p-4">
              <NavigationMenuLink href="#">
                <div className="font-medium">계정 설정</div>
                <p className="text-muted-foreground text-sm">계정 정보를 수정합니다.</p>
              </NavigationMenuLink>
              <NavigationMenuLink href="#">
                <div className="font-medium">알림 설정</div>
                <p className="text-muted-foreground text-sm">알림 수신 여부를 설정합니다.</p>
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

export const TwoColumnLayout: Story = {
  render: () => (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>제품</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[500px] grid-cols-2 gap-3 p-4">
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-500">솔루션</h4>
                <NavigationMenuLink href="#">
                  <div className="font-medium">기업용</div>
                  <p className="text-muted-foreground text-sm">기업 맞춤 솔루션</p>
                </NavigationMenuLink>
                <NavigationMenuLink href="#">
                  <div className="font-medium">스타트업</div>
                  <p className="text-muted-foreground text-sm">성장하는 팀을 위한 솔루션</p>
                </NavigationMenuLink>
              </div>
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-500">기능</h4>
                <NavigationMenuLink href="#">
                  <div className="font-medium">분석</div>
                  <p className="text-muted-foreground text-sm">상세 분석 리포트</p>
                </NavigationMenuLink>
                <NavigationMenuLink href="#">
                  <div className="font-medium">자동화</div>
                  <p className="text-muted-foreground text-sm">워크플로우 자동화</p>
                </NavigationMenuLink>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

export const SimpleLinks: Story = {
  render: () => (
    <NavigationMenu viewport={false}>
      <NavigationMenuList className="gap-6">
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className="font-medium">
            홈
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className="font-medium">
            서비스
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className="font-medium">
            가격
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className="font-medium">
            문의
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};
