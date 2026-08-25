'use client';

import { useState } from 'react';
import { Leaf } from 'lucide-react';

interface PlantImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
}

export default function PlantImage({ src, alt, className = '', fallbackClassName = '' }: PlantImageProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  if (!src || error) {
    return (
      <div className={`plant-image-fallback ${fallbackClassName} ${className}`}>
        <Leaf className="w-12 h-12 opacity-50" />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className={`plant-image-fallback absolute inset-0 ${fallbackClassName}`}>
          <Leaf className="w-8 h-8 opacity-50 animate-pulse" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`w-full h-full object-cover ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
      />
    </div>
  );
}
