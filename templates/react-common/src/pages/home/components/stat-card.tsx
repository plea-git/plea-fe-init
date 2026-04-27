import type { StatCard as StatCardType } from '../_types';

interface StatCardProps {
  card: StatCardType;
}

export function StatCard({ card }: StatCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 p-6">
      <p className="text-sm text-gray-500">{card.title}</p>
      <p className="mt-1 text-2xl font-bold">{card.value}</p>
      {card.description && <p className="mt-1 text-xs text-gray-400">{card.description}</p>}
    </div>
  );
}
