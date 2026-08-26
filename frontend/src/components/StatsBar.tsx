import type { Stats } from '@/lib/api';

interface StatsBarProps {
  stats: Stats | null;
}

export default function StatsBar({ stats }: StatsBarProps) {
  const items = [
  { label: '记录总数', value: stats?.total_records ?? '—' },
  { label: '植物科数', value: stats?.total_families ?? '—' },
  { label: '本土种', value: stats?.native_species ?? '—' },
  { label: '外来种', value: stats?.exotic_species ?? '—' },
  { label: '入侵种', value: stats?.invasive_species ?? '—' },
];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {items.map((item, i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-gray-100 p-6 text-center shadow-sm animate-slide-up"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <p className="text-3xl md:text-4xl font-bold text-plant-green-700 mb-1">
            {item.value}
          </p>
          <p className="text-sm text-gray-500">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
