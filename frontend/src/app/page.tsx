'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, PlusCircle, List, ArrowRight, Leaf } from 'lucide-react';
import { api, Plant, Stats } from '@/lib/api';
import StatsBar from '@/components/StatsBar';
import PlantCard from '@/components/PlantCard';

export default function HomePage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentPlants, setRecentPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getStats().catch(() => ({ data: null })),
      api.getRecentPlants(6).catch(() => ({ data: [] })),
    ]).then(([statsRes, recentRes]) => {
      setStats(statsRes.data);
      setRecentPlants(recentRes.data || []);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/hefanyuxiu/hero-bg.png)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex justify-center mb-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-3">
                <Leaf className="w-8 h-8" />
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              自生植物多样性
              <br />
              调查数据库查询系统
            </h1>
            <p className="text-lg text-white/90 mb-8 leading-relaxed">
              记录、查询与管理黄河流域（河南段）自生植物调查数据。
              用户可随时录入新的调查记录，上传植株照片，共同构建不断丰富的植物多样性数据库。
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/search" className="btn-primary bg-white text-plant-green-700 hover:bg-gray-100">
                <Search className="w-5 h-5 mr-2" />
                开始查询
              </Link>
              <Link href="/add" className="btn-secondary bg-transparent text-white border-white/30 hover:bg-white/10">
                <PlusCircle className="w-5 h-5 mr-2" />
                录入数据
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <StatsBar stats={stats} />
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={Search}
            title="数据查询"
            description="按名称、科属、生活型、生境等多条件组合检索植物数据"
            href="/search"
          />
          <FeatureCard
            icon={PlusCircle}
            title="数据录入"
            description="随时添加你的野外调查记录，上传植株照片，丰富数据库"
            href="/add"
          />
          <FeatureCard
            icon={List}
            title="数据浏览"
            description="浏览全部植物记录，查看详细信息与生境分布"
            href="/browse"
          />
        </div>
      </section>

      {/* Recent Records */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">最近记录</h2>
          <Link href="/browse" className="text-plant-green-700 hover:text-plant-green-800 text-sm font-medium flex items-center gap-1">
            查看全部
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="aspect-[4/3] bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-6 bg-gray-200 rounded w-2/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : recentPlants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPlants.map(plant => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">暂无记录数据</p>
            <p className="text-sm mt-2">请配置后端API和数据库连接</p>
          </div>
        )}
      </section>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link href={href} className="card p-6 group hover:border-plant-green-200">
      <div className="w-12 h-12 bg-plant-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-plant-green-200 transition-colors">
        <Icon className="w-6 h-6 text-plant-green-700" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
      <div className="mt-4 text-plant-green-700 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
        进入
        <ArrowRight className="w-4 h-4" />
      </div>
    </Link>
  );
}
