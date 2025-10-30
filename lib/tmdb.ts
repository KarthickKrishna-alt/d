import { Movie, MovieDetails, MoviesResponse, GenresResponse } from '@/types/movie';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

if (!API_KEY) {
  console.warn('TMDB API key is not set. Please add NEXT_PUBLIC_TMDB_API_KEY to your .env.local file');
}

export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const tmdbApi = {
  // Get trending movies
  getTrending: async (page: number = 1): Promise<MoviesResponse> => {
    const response = await fetch(
      `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&page=${page}`,
      { next: { revalidate: 3600 } }
    );
    if (!response.ok) throw new Error('Failed to fetch trending movies');
    return response.json();
  },

  // Search movies
  searchMovies: async (query: string, page: number = 1): Promise<MoviesResponse> => {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`,
      { next: { revalidate: 3600 } }
    );
    if (!response.ok) throw new Error('Failed to search movies');
    return response.json();
  },

  // Get movie details
  getMovieDetails: async (movieId: number): Promise<MovieDetails> => {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`,
      { next: { revalidate: 3600 } }
    );
    if (!response.ok) throw new Error('Failed to fetch movie details');
    return response.json();
  },

  // Get all genres
  getGenres: async (): Promise<GenresResponse> => {
    const response = await fetch(
      `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`,
      { next: { revalidate: 86400 } } // Cache for 24 hours
    );
    if (!response.ok) throw new Error('Failed to fetch genres');
    return response.json();
  },

  // Discover movies with filters
  discoverMovies: async (
    page: number = 1,
    genreId?: number,
    minRating?: number
  ): Promise<MoviesResponse> => {
    let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&page=${page}&sort_by=popularity.desc`;
    
    if (genreId) {
      url += `&with_genres=${genreId}`;
    }
    
    if (minRating) {
      url += `&vote_average.gte=${minRating}`;
    }
    
    const response = await fetch(url, { next: { revalidate: 3600 } });
    if (!response.ok) throw new Error('Failed to discover movies');
    return response.json();
  },

  // Get poster URL
  getPosterUrl: (path: string | null, size: string = 'w500'): string => {
    if (!path) return '/placeholder-movie.svg';
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
  },

  // Get backdrop URL
  getBackdropUrl: (path: string | null, size: string = 'w1280'): string => {
    if (!path) return '/placeholder-movie.svg';
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
  },
};
