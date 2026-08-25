'use client';

import { useEffect, useState } from 'react';
import { api, Plant } from '@/lib/api';
import PlantCard from '@/components/PlantCard';
import { Search as SearchIcon } from 'lucide-react';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [results, setResults] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await api.searchPlants(query, searchType);
      setResults(res.data || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Load all plants initially
  useEffect(() => {
    api.getPlants(1, 100).then(res => {
      setResults(res.data);
    }).catch(() => {});
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">数据查询</h1>
        <p className="text-gray-500 mt-1">按名称、科属等信息检索植物数据</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <select
            value={searchType}
            onChange={e => setSearchType(e.target.value)}
            className="input-field md:max-w-[180px] text-sm"
          >
            <option value="all">全部字段</option>
            <option value="name_cn">中文名</option>
            <option value="name_latin">拉丁学名</option>
            <option value="family">科</option>
            <option value="genus">属</option>
          </select>
          <div className="flex-1 relative">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="输入关键词搜索..."
              className="input-field pl-10"
            />
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          <button onClick={handleSearch} className="btn-primary">
            <SearchIcon className="w-5 h-5 mr-2" />
            搜索
          </button>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-plant-green-200 border-t-plant-green-700 rounded-full animate-spin" />
          <p className="text-gray-400 mt-4">搜索中...</p>
        </div>
      ) : searched ? (
        <>
          <p className="text-sm text-gray-500 mb-4">
            找到 {results.length} 条结果
          </p>
          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map(plant => (
                <PlantCard key={plant.id} plant={plant} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg">未找到匹配的植物记录</p>
              <p className="text-sm mt-2">尝试更换关键词或搜索条件</p>
            </div>
          )}
        </>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">
            共 {results.length} 条记录
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map(plant => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
