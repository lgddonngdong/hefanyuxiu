'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, Plant } from '@/lib/api';
import PlantImage from '@/components/PlantImage';
import { ArrowLeft, MapPin, Calendar, Leaf, ExternalLink, Trash2 } from 'lucide-react';

export default function PlantDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const [plant, setPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const numId = parseInt(id);
    if (!isNaN(numId)) {
      api.getPlant(numId)
        .then(res => setPlant(res.data))
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleDelete = async () => {
    if (!plant || !confirm(`确定要删除"${plant.name_cn}"的记录吗？`)) return;
    try {
      await api.deletePlant(plant.id);
      router.push('/browse');
    } catch (err) {
      alert('删除失败：' + (err as Error).message);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
          <div className="aspect-video bg-gray-200 rounded-xl mb-6" />
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !plant) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-lg text-gray-400">{error || '未找到该植物记录'}</p>
        <Link href="/browse" className="text-plant-green-700 hover:underline mt-4 inline-block">
          返回浏览
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <Link href="/browse" className="inline-flex items-center gap-1 text-plant-green-700 hover:text-plant-green-800 mb-6 text-sm">
        <ArrowLeft className="w-4 h-4" />
        返回列表
      </Link>

      {/* Plant Detail */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        {/* Image */}
        <div className="aspect-[16/9] bg-gray-100 overflow-hidden">
          <PlantImage
            src={plant.image_url}
            alt={plant.name_cn}
            className="w-full h-full"
            fallbackClassName="w-full h-full"
          />
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {plant.is_native ? (
                  <span className="badge-native">本土种</span>
                ) : (
                  <span className="badge-exotic">外来种</span>
                )}
                <span className="text-xs text-gray-400">#{plant.id}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{plant.name_cn}</h1>
              <p className="text-lg italic text-gray-500 mt-1">{plant.name_latin}</p>
            </div>
            <button
              onClick={handleDelete}
              className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
              title="删除记录"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
            <InfoItem label="科" value={plant.family} />
            <InfoItem label="属" value={plant.genus} />
            <InfoItem label="生活型" value={plant.life_form} />
            <InfoItem label="生境" value={plant.habitat} />
          </div>

          {/* Description */}
          {plant.description && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-2">描述</h2>
              <p className="text-gray-600 leading-relaxed">{plant.description}</p>
            </div>
          )}

          {/* Location & Date */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 border-t border-gray-100 pt-4">
            {plant.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {plant.location}
              </span>
            )}
            {plant.survey_date && (
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                调查日期：{plant.survey_date}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Leaf className="w-4 h-4" />
              录入时间：{new Date(plant.created_at).toLocaleDateString('zh-CN')}
            </span>
          </div>

          {/* Wikipedia Link */}
          {plant.wikipedia_url && (
            <div className="mt-6">
              <a
                href={plant.wikipedia_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-plant-green-700 hover:text-plant-green-800 hover:underline"
              >
                查看维基百科详情
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-sm font-medium text-gray-700">{value || '—'}</p>
    </div>
  );
}
