import Link from 'next/link';
import { MapPin, Calendar } from 'lucide-react';
import PlantImage from './PlantImage';
import type { Plant } from '@/lib/api';

export default function PlantCard({ plant }: { plant: Plant }) {
  return (
    <Link href={`/plant/${plant.id}`} className="card group block animate-fade-in">
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden">
        <PlantImage
          src={plant.image_url}
          alt={plant.name_cn}
          className="w-full h-full group-hover:scale-105 transition-transform duration-300"
          fallbackClassName="w-full h-full"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Badges */}
        <div className="flex items-center gap-2 mb-2">
          {plant.is_native ? (
            <span className="badge-native">本土种</span>
          ) : (
            <span className="badge-exotic">外来种</span>
          )}
          <span className="text-xs text-gray-400">#{plant.id}</span>
        </div>

        {/* Name */}
        <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-plant-green-700 transition-colors">
          {plant.name_cn}
        </h3>
        <p className="text-sm italic text-gray-500 mb-2">{plant.name_latin}</p>

        {/* Info */}
        <div className="space-y-1 text-xs text-gray-500">
          <p className="flex items-center gap-1">
            <span className="text-plant-green-600 font-medium">{plant.life_form}</span>
            <span>·</span>
            <span>{plant.family}</span>
          </p>
          {plant.location && (
            <p className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{plant.location}</span>
            </p>
          )}
          {plant.survey_date && (
            <p className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{plant.survey_date}</span>
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
