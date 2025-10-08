'use client';

import { Heart } from 'lucide-react';
import { useTransition } from 'react';
import { toggleFavorite } from '@/app/action';

interface FavoriteButtonProps {
  foodId: string;
  isFavorited: boolean;
}

export default function FavoriteButton({ foodId, isFavorited }: FavoriteButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    startTransition(async () => {
      await toggleFavorite(foodId);
    });
  };

  return (
    <button title='like' onClick={handleFavoriteClick} disabled={isPending} className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100 disabled:opacity-50">
      <Heart
        className={`w-5 h-5 transition-colors ${isFavorited ? 'text-red-500 fill-red-500' : 'text-gray-400'}`}
      />
    </button>
  );
}