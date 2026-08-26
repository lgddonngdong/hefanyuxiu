'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { CheckCircle, AlertCircle } from 'lucide-react';

export default function AddPlantPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name_cn: '',
    name_latin: '',
    family: '',
    genus: '',
    image_url: '',
    description: '',
    is_native: true,
    is_invasive: false,
    life_form: '草本',
    habitat: '',
    location: '',
    survey_date: new Date().toISOString().split('T')[0],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await api.createPlant(formData);
      setSuccess(true);
      setTimeout(() => router.push('/browse'), 2000);
    } catch (err) {
      setError((err as Error).message || '提交失败');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <CheckCircle className="w-16 h-16 text-plant-green-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">录入成功！</h2>
        <p className="text-gray-500">记录已添加到数据库，正在跳转...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">录入数据</h1>
        <p className="text-gray-500 mt-1">添加新的植物调查记录到数据库</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-2 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        {/* Required fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="中文名" required>
            <input
              type="text"
              name="name_cn"
              value={formData.name_cn}
              onChange={handleChange}
              required
              placeholder="如：蒲公英"
              className="input-field"
            />
          </FormField>

          <FormField label="拉丁学名" required>
            <input
              type="text"
              name="name_latin"
              value={formData.name_latin}
              onChange={handleChange}
              required
              placeholder="如：Taraxacum mongolicum"
              className="input-field"
            />
          </FormField>

          <FormField label="科" required>
            <input
              type="text"
              name="family"
              value={formData.family}
              onChange={handleChange}
              required
              placeholder="如：菊科"
              className="input-field"
            />
          </FormField>

          <FormField label="属" required>
            <input
              type="text"
              name="genus"
              value={formData.genus}
              onChange={handleChange}
              required
              placeholder="如：蒲公英属"
              className="input-field"
            />
          </FormField>
        </div>

        {/* Optional fields */}
        <FormField label="图片URL">
          <input
            type="url"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            placeholder="https://..."
            className="input-field"
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="生活型">
            <select name="life_form" value={formData.life_form} onChange={handleChange} className="input-field">
              <option value="草本">草本</option>
              <option value="木本">木本</option>
              <option value="藤本">藤本</option>
              <option value="一年生草本">一年生草本</option>
              <option value="多年生草本">多年生草本</option>
              <option value="灌木">灌木</option>
              <option value="乔木">乔木</option>
            </select>
          </FormField>

          <FormField label="生境">
            <input
              type="text"
              name="habitat"
              value={formData.habitat}
              onChange={handleChange}
              placeholder="如：河岸、田野、路旁"
              className="input-field"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="调查地点">
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="如：郑州市金水区"
              className="input-field"
            />
          </FormField>

          <FormField label="调查日期">
            <input
              type="date"
              name="survey_date"
              value={formData.survey_date}
              onChange={handleChange}
              className="input-field"
            />
          </FormField>
        </div>

        <FormField label="描述">
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="植物特征、生长环境等描述..."
            className="input-field resize-none"
          />
        </FormField>

        {/* Native checkbox */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_native"
              checked={formData.is_native}
              onChange={handleChange}
              className="w-4 h-4 rounded border-gray-300 text-plant-green-600 focus:ring-plant-green-400"
            />
            <label className="text-sm text-gray-700">本土种</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_invasive"
              checked={formData.is_invasive}
              onChange={handleChange}
              className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-400"
            />
            <label className="text-sm text-gray-700">入侵种</label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary flex-1 disabled:opacity-50"
          >
            {submitting ? '提交中...' : '提交记录'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-secondary"
          >
            取消
          </button>
        </div>
      </form>
    </div>
  );
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
