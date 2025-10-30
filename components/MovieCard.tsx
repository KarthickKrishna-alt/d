'use client';

import { Movie } from '@/types/movie';
import { tmdbApi } from '@/lib/tmdb';
import { favoritesManager } from '@/lib/favorites';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
}

export default function MovieCard({ movie, onClick }: MovieCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setIsFavorite(favoritesManager.isFavorite(movie.id));
  }, [movie.id]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newState = favoritesManager.toggleFavorite(movie);
    setIsFavorite(newState);
  };

  const posterUrl = tmdbApi.getPosterUrl(movie.poster_path);
  const rating = movie.vote_average.toFixed(1);

  return (
    <div
      className="group relative cursor-pointer overflow-hidden rounded-lg bg-gray-800 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in"
      onClick={() => onClick(movie)}
    >
      <div className="relative aspect-[2/3] w-full">
        <Image
          src={posterUrl}
          alt={movie.title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover"
          priority={false}
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-lg font-bold text-white line-clamp-2">
              {movie.title}
            </h3>
            <p className="mt-1 text-sm text-gray-300 line-clamp-3">
              {movie.overview}
            </p>
          </div>
        </div>
      </div>

      {/* Rating badge */}
      <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 backdrop-blur-sm">
        <svg
          className="h-4 w-4 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <span className="text-sm font-semibold text-white">{rating}</span>
      </div>

      {/* Favorite button */}
      <button
        onClick={handleFavoriteClick}
        className="absolute top-2 right-2 rounded-full bg-black/70 p-2 backdrop-blur-sm transition-colors hover:bg-black/90"
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <svg
          className={`h-5 w-5 transition-colors ${
            isFavorite ? 'fill-red-500 text-red-500' : 'text-white'
          }`}
          fill={isFavorite ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>

      {/* Release year */}
      {movie.release_date && (
        <div className="absolute bottom-2 right-2 rounded-full bg-black/70 px-2 py-1 backdrop-blur-sm">
          <span className="text-xs font-medium text-white">
            {new Date(movie.release_date).getFullYear()}
          </span>
        </div>
      )}
    </div>
  );
}
