'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Movie, Genre } from '@/types/movie';
import { tmdbApi } from '@/lib/tmdb';
import { favoritesManager } from '@/lib/favorites';
import MovieCard from '@/components/MovieCard';
import MovieModal from '@/components/MovieModal';
import SearchBar from '@/components/SearchBar';
import FilterBar from '@/components/FilterBar';
import ApiKeyWarning from '@/components/ApiKeyWarning';

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState<Movie[]>([]);
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Check if API key is configured (client-side validation for UX)
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const hasApiKey = Boolean(apiKey && apiKey.length > 10 && !apiKey.includes('demo_key'));

  // Fetch genres on mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await tmdbApi.getGenres();
        setGenres(data.genres);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };
    fetchGenres();
  }, []);

  // Load favorites
  useEffect(() => {
    setFavorites(favoritesManager.getFavorites());
  }, [selectedMovie]); // Refresh when modal closes

  // Fetch movies based on filters
  const fetchMovies = useCallback(async (pageNum: number, append: boolean = false) => {
    if (loading || !hasApiKey) return;
    
    setLoading(true);
    try {
      let data;
      if (searchQuery) {
        data = await tmdbApi.searchMovies(searchQuery, pageNum);
      } else if (selectedGenre || selectedRating) {
        data = await tmdbApi.discoverMovies(pageNum, selectedGenre || undefined, selectedRating || undefined);
      } else {
        data = await tmdbApi.getTrending(pageNum);
      }
      
      if (append) {
        setMovies(prev => [...prev, ...data.results]);
      } else {
        setMovies(data.results);
      }
      
      setHasMore(pageNum < data.total_pages);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedGenre, selectedRating, loading, hasApiKey]);

  // Reset and fetch when filters change
  useEffect(() => {
    setPage(1);
    setMovies([]);
    fetchMovies(1, false);
  }, [searchQuery, selectedGenre, selectedRating]);

  // Infinite scroll observer
  useEffect(() => {
    if (loading || !hasMore || showFavorites) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchMovies(nextPage, true);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loading, hasMore, page, fetchMovies, showFavorites]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const displayedMovies = showFavorites ? favorites : movies;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-800 bg-gray-950/90 backdrop-blur-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-white md:text-4xl">
              🎬 Movie Explorer
            </h1>
            
            <button
              onClick={() => setShowFavorites(!showFavorites)}
              className="flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 transition-colors hover:bg-gray-700"
            >
              <svg
                className={`h-5 w-5 ${showFavorites ? 'fill-red-500 text-red-500' : 'text-white'}`}
                fill={showFavorites ? 'currentColor' : 'none'}
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
              <span>
                {showFavorites ? 'Show All' : `Favorites (${favorites.length})`}
              </span>
            </button>
          </div>

          {!showFavorites && (
            <>
              <SearchBar onSearch={handleSearch} />
              
              <div className="mt-4">
                <FilterBar
                  genres={genres}
                  selectedGenre={selectedGenre}
                  selectedRating={selectedRating}
                  onGenreChange={setSelectedGenre}
                  onRatingChange={setSelectedRating}
                />
              </div>
            </>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {!hasApiKey ? (
          <ApiKeyWarning />
        ) : displayedMovies.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <svg
              className="h-24 w-24 text-gray-700 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
              />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-400">
              {showFavorites ? 'No favorites yet' : 'No movies found'}
            </h2>
            <p className="mt-2 text-gray-500">
              {showFavorites 
                ? 'Start adding movies to your favorites!' 
                : 'Try adjusting your search or filters'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {displayedMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onClick={setSelectedMovie}
                />
              ))}
            </div>

            {/* Loading indicator */}
            {loading && (
              <div className="mt-8 flex justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-700 border-t-blue-500"></div>
              </div>
            )}

            {/* Infinite scroll trigger */}
            {!showFavorites && hasMore && (
              <div ref={loadMoreRef} className="h-20" />
            )}
          </>
        )}
      </main>

      {/* Movie modal */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-950 py-8 mt-20">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>Powered by TMDB API</p>
          <p className="mt-2 text-sm">
            Built with Next.js, TypeScript, and Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}
