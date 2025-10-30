'use client';

import { Genre } from '@/types/movie';

interface FilterBarProps {
  genres: Genre[];
  selectedGenre: number | null;
  selectedRating: number | null;
  onGenreChange: (genreId: number | null) => void;
  onRatingChange: (rating: number | null) => void;
}

const RATING_OPTIONS = [
  { value: null, label: 'All Ratings' },
  { value: 7, label: '7+ Stars' },
  { value: 8, label: '8+ Stars' },
  { value: 9, label: '9+ Stars' },
];

export default function FilterBar({
  genres,
  selectedGenre,
  selectedRating,
  onGenreChange,
  onRatingChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      {/* Genre filter */}
      <div className="flex items-center gap-2">
        <label htmlFor="genre" className="text-sm font-medium text-gray-300">
          Genre:
        </label>
        <select
          id="genre"
          value={selectedGenre || ''}
          onChange={(e) => onGenreChange(e.target.value ? Number(e.target.value) : null)}
          className="rounded-lg bg-gray-800 px-4 py-2 text-white outline-none ring-2 ring-transparent transition-all focus:ring-blue-500"
        >
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>

      {/* Rating filter */}
      <div className="flex items-center gap-2">
        <label htmlFor="rating" className="text-sm font-medium text-gray-300">
          Rating:
        </label>
        <select
          id="rating"
          value={selectedRating || ''}
          onChange={(e) => onRatingChange(e.target.value ? Number(e.target.value) : null)}
          className="rounded-lg bg-gray-800 px-4 py-2 text-white outline-none ring-2 ring-transparent transition-all focus:ring-blue-500"
        >
          {RATING_OPTIONS.map((option) => (
            <option key={option.label} value={option.value || ''}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Clear filters button */}
      {(selectedGenre || selectedRating) && (
        <button
          onClick={() => {
            onGenreChange(null);
            onRatingChange(null);
          }}
          className="rounded-lg bg-gray-700 px-4 py-2 text-sm text-white transition-colors hover:bg-gray-600"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}
