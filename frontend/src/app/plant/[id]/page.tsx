import { mockPlants } from '@/lib/mock-data';
import PlantDetailClient from './client';

// Pre-generate all plant detail pages for static export
export function generateStaticParams() {
  return mockPlants.map((plant) => ({
    id: String(plant.id),
  }));
}

export default function PlantDetailPage({ params }: { params: { id: string } }) {
  return <PlantDetailClient id={params.id} />;
}
