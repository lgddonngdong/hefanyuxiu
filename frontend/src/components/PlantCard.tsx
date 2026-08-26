'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Calendar } from 'lucide-react';
import PlantImage from './PlantImage';
import type { Plant } from '@/lib/api';

// Fetch Wikipedia image for a plant
async function fetchWikiImage(latinName: string): Promise<string> {
  if (!latinName) return '';
  try {
    const encoded = encodeURIComponent(latinName);
    const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&titles=${encoded}&pithumbsize=400&origin=*`;
    const resp = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (resp.ok) {
      const data = await resp.json();
      const pages = data?.query?.pages || {};
      for (const pageId of Object.keys(pages)) {
        const page = pages[pageId];
        if (page.thumbnail?.source) return page.thumbnail.source;
      }
    }
  } catch {
    // Fallback to REST API
    try {
      const encoded = encodeURIComponent(latinName);
      const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encoded}`;
      const resp = await fetch(url, { signal: AbortSignal.timeout(6000) });
      if (resp.ok) {
        const data = await resp.json();
        if (data.thumbnail?.source) return data.thumbnail.source;
        if (data.originalimage?.source) return data.originalimage.source;
      }
    } catch {
      // Both failed
    }
  }
  return '';
}

export default function PlantCard({ plant }: { plant: Plant }) {
  const [imageUrl, setImageUrl] = useState(plant.image_url || '');

  useEffect(() => {
    if (plant.image_url) {
      setImageUrl(plant.image_url);
      return;
    }
    let cancelled = false;
    fetchWikiImage(plant.name_latin).then(url => {
      if (!cancelled && url) setImageUrl(url);
    });
    return () => { cancelled = true; };
  }, [plant.image_url, plant.name_latin]);

  return (
    <Link href={`/plant/${plant.id}`} className="card group block animate-fade-in">
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden">
        <PlantImage
          src={imageUrl}
          alt={plant.name_cn}
          className="w-full h-full group-hover:scale-105 transition-transform duration-300"
          fallbackClassName="w-full h-full"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Badges */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {plant.is_native ? (
            <span className="badge-native">本土种</span>
          ) : (
            <span className="badge-exotic">外来种</span>
          )}
          {plant.is_invasive && (
            <span className="badge-invasive">入侵种</span>
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
