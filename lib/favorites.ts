import { Movie } from '@/types/movie';

const FAVORITES_KEY = 'movie-favorites';

export const favoritesManager = {
  // Get all favorites from localStorage
  getFavorites: (): Movie[] => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading favorites:', error);
      return [];
    }
  },

  // Add a movie to favorites
  addFavorite: (movie: Movie): void => {
    if (typeof window === 'undefined') return;
    try {
      const favorites = favoritesManager.getFavorites();
      if (!favorites.some(fav => fav.id === movie.id)) {
        favorites.push(movie);
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      }
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  },

  // Remove a movie from favorites
  removeFavorite: (movieId: number): void => {
    if (typeof window === 'undefined') return;
    try {
      const favorites = favoritesManager.getFavorites();
      const filtered = favorites.filter(fav => fav.id !== movieId);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  },

  // Check if a movie is in favorites
  isFavorite: (movieId: number): boolean => {
    if (typeof window === 'undefined') return false;
    try {
      const favorites = favoritesManager.getFavorites();
      return favorites.some(fav => fav.id === movieId);
    } catch (error) {
      console.error('Error checking favorite:', error);
      return false;
    }
  },

  // Toggle favorite status
  toggleFavorite: (movie: Movie): boolean => {
    const isFav = favoritesManager.isFavorite(movie.id);
    if (isFav) {
      favoritesManager.removeFavorite(movie.id);
      return false;
    } else {
      favoritesManager.addFavorite(movie);
      return true;
    }
  },
};
