import { Movie } from '../types/movie';

const WATCHED_MOVIES_KEY = 'cinematch_watched_movies';

export interface WatchedMovie extends Movie {
  id: string;
  watchedAt: string;
}

// Generate unique ID for movies
const generateMovieId = (movie: Movie): string => {
  return btoa(movie.name + movie.genre).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
};

// Get all watched movies
export const getWatchedMovies = (): WatchedMovie[] => {
  try {
    const watched = localStorage.getItem(WATCHED_MOVIES_KEY);
    return watched ? JSON.parse(watched) : [];
  } catch (error) {
    console.error('Error loading watched movies:', error);
    return [];
  }
};

// Mark a movie as watched
export const markAsWatched = (movie: Movie): boolean => {
  try {
    const watchedMovies = getWatchedMovies();
    const movieId = generateMovieId(movie);
    
    // Check if already watched
    if (watchedMovies.some(watched => watched.id === movieId)) {
      return false; // Already watched
    }
    
    const watchedMovie: WatchedMovie = {
      ...movie,
      id: movieId,
      watchedAt: new Date().toISOString(),
    };
    
    watchedMovies.unshift(watchedMovie); // Add to beginning
    localStorage.setItem(WATCHED_MOVIES_KEY, JSON.stringify(watchedMovies));
    return true;
  } catch (error) {
    console.error('Error marking movie as watched:', error);
    return false;
  }
};

// Remove a movie from watched list
export const removeFromWatched = (movieId: string): boolean => {
  try {
    const watchedMovies = getWatchedMovies();
    const filteredMovies = watchedMovies.filter(movie => movie.id !== movieId);
    localStorage.setItem(WATCHED_MOVIES_KEY, JSON.stringify(filteredMovies));
    return true;
  } catch (error) {
    console.error('Error removing watched movie:', error);
    return false;
  }
};

// Check if a movie is watched
export const isMovieWatched = (movie: Movie): boolean => {
  const movieId = generateMovieId(movie);
  const watchedMovies = getWatchedMovies();
  return watchedMovies.some(watched => watched.id === movieId);
};

// Clear all watched movies
export const clearAllWatchedMovies = (): void => {
  localStorage.removeItem(WATCHED_MOVIES_KEY);
};

// Get watched movies count
export const getWatchedMoviesCount = (): number => {
  return getWatchedMovies().length;
};