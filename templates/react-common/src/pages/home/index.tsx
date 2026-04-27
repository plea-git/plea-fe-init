import { Head } from '@/shared/components/seo/Head';
import type { StatCard as StatCardType } from './_types';
import { StatCard, WelcomeBanner } from './components';

const stats: StatCardType[] = [
  { title: '총 사용자', value: '1,234', trend: 'up' },
  { title: '오늘 방문', value: 56, trend: 'up' },
  { title: '활성 프로젝트', value: 8, trend: 'neutral' },
];

export function HomePage() {
  return (
    <div className="space-y-6">
      <Head title="홈" description="dev3-thor 프론트엔드 팀 공통 React 베이스 프로젝트" />
      <WelcomeBanner />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((card) => (
          <StatCard key={card.title} card={card} />
        ))}
      </div>
    </div>
  );
}
