'use client';

import { useEffect, useState } from 'react';
import { api, Plant } from '@/lib/api';
import PlantCard from '@/components/PlantCard';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';

export default function BrowsePage() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filterFamily, setFilterFamily] = useState('');
  const [families, setFamilies] = useState<string[]>([]);
  const [filterNative, setFilterNative] = useState<string>('');
  const [error, setError] = useState('');

  useEffect(() => {
    const filters: Record<string, string> = {};
    if (filterFamily) filters.family = filterFamily;
    if (filterNative) filters.is_native = filterNative;

    setLoading(true);
    setError('');
    api.getPlants(page, 12, filters).then(res => {
      setPlants(res.data);
      setTotalPages(res.pagination.total_pages);
      setTotal(res.pagination.total);
      setLoading(false);
    }).catch((err) => {
      setError(err.message || '加载数据失败');
      setLoading(false);
    });
  }, [page, filterFamily, filterNative]);

  useEffect(() => {
    api.getFamilies().then(res => {
      setFamilies(res.data.map(f => f.family));
    }).catch(() => {});
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">数据浏览</h1>
        <p className="text-gray-500 mt-1">共 {total} 条记录</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Filter className="w-4 h-4" />
          <span>筛选：</span>
        </div>
        <select
          value={filterFamily}
          onChange={e => { setFilterFamily(e.target.value); setPage(1); }}
          className="input-field max-w-xs text-sm"
        >
          <option value="">全部科</option>
          {families.map(f => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
        <select
          value={filterNative}
          onChange={e => { setFilterNative(e.target.value); setPage(1); }}
          className="input-field max-w-xs text-sm"
        >
          <option value="">全部类型</option>
          <option value="true">本土种</option>
          <option value="false">外来种</option>
        </select>
        {(filterFamily || filterNative) && (
          <button
            onClick={() => { setFilterFamily(''); setFilterNative(''); setPage(1); }}
            className="text-sm text-plant-green-700 hover:underline"
          >
            清除筛选
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Plants Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="aspect-[4/3] bg-gray-200" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-6 bg-gray-200 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : plants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {plants.map(plant => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">未找到符合条件的植物记录</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm text-gray-600 px-4">
            第 {page} / {totalPages} 页
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
