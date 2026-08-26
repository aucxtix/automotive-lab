import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { cars, getCar } from '@/data/cars';
import CarDetailClient from '@/components/CarDetailClient';
import CustomCursor from '@/components/CustomCursor';
import ParticleBackground from '@/components/ParticleBackground';

interface Props {
  params: { carId: string };
}

export async function generateStaticParams() {
  return cars.map(car => ({ carId: car.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const car = getCar(params.carId);
  if (!car) return { title: 'Car Not Found' };

  return {
    title: `${car.name} ${car.model} ${car.year}`,
    description: car.description,
    openGraph: {
      title: `${car.name} ${car.model} — AUTOMOTIVE LAB`,
      description: car.description,
      images: [{ url: car.heroImage, width: 1920, height: 1080, alt: `${car.name} ${car.model}` }],
    },
  };
}

export default function CarPage({ params }: Props) {
  const car = getCar(params.carId);
  if (!car) notFound();

  return (
    <>
      <CustomCursor />
      <ParticleBackground />
      <CarDetailClient car={car} />
    </>
  );
}
