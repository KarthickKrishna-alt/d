'use client';

import { Movie, MovieDetails } from '@/types/movie';
import { tmdbApi } from '@/lib/tmdb';
import { favoritesManager } from '@/lib/favorites';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

export default function MovieModal({ movie, onClose }: MovieModalProps) {
  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setIsFavorite(favoritesManager.isFavorite(movie.id));
    
    const fetchDetails = async () => {
      try {
        const data = await tmdbApi.getMovieDetails(movie.id);
        setDetails(data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [movie.id]);

  const handleFavoriteClick = () => {
    const newState = favoritesManager.toggleFavorite(movie);
    setIsFavorite(newState);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const backdropUrl = tmdbApi.getBackdropUrl(movie.backdrop_path);
  const posterUrl = tmdbApi.getPosterUrl(movie.poster_path);
  const rating = movie.vote_average.toFixed(1);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-gray-900 shadow-2xl animate-slide-up">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 rounded-full bg-black/50 p-2 backdrop-blur-sm transition-colors hover:bg-black/70"
          aria-label="Close modal"
        >
          <svg
            className="h-6 w-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Backdrop image */}
        <div className="relative h-64 w-full md:h-96">
          <Image
            src={backdropUrl}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative -mt-32 px-6 pb-8">
          <div className="flex flex-col gap-6 md:flex-row">
            {/* Poster */}
            <div className="relative aspect-[2/3] w-48 shrink-0 overflow-hidden rounded-lg shadow-2xl">
              <Image
                src={posterUrl}
                alt={movie.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Details */}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-white md:text-4xl">
                    {movie.title}
                  </h2>
                  {details?.tagline && (
                    <p className="mt-2 text-lg italic text-gray-400">
                      "{details.tagline}"
                    </p>
                  )}
                </div>
                
                <button
                  onClick={handleFavoriteClick}
                  className="shrink-0 rounded-full bg-gray-800 p-3 transition-colors hover:bg-gray-700"
                  aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <svg
                    className={`h-6 w-6 transition-colors ${
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
              </div>

              {/* Metadata */}
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-300">
                <div className="flex items-center gap-1">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-semibold">{rating}/10</span>
                  <span className="text-gray-500">
                    ({movie.vote_count.toLocaleString()} votes)
                  </span>
                </div>

                {movie.release_date && (
                  <span>
                    {new Date(movie.release_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                )}

                {details?.runtime && (
                  <span>{Math.floor(details.runtime / 60)}h {details.runtime % 60}m</span>
                )}
              </div>

              {/* Genres */}
              {loading ? (
                <div className="mt-4 flex gap-2">
                  <div className="h-6 w-20 animate-pulse rounded-full bg-gray-700" />
                  <div className="h-6 w-20 animate-pulse rounded-full bg-gray-700" />
                </div>
              ) : (
                details?.genres && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {details.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="rounded-full bg-gray-800 px-3 py-1 text-sm text-gray-300"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )
              )}

              {/* Overview */}
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-white">Overview</h3>
                <p className="mt-2 text-gray-300 leading-relaxed">
                  {movie.overview || 'No overview available.'}
                </p>
              </div>

              {/* Additional info */}
              {details && (
                <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                  {details.status && (
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <span className="ml-2 text-white">{details.status}</span>
                    </div>
                  )}
                  {details.original_language && (
                    <div>
                      <span className="text-gray-500">Language:</span>
                      <span className="ml-2 text-white uppercase">
                        {details.original_language}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
