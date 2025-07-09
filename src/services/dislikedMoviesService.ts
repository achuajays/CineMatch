import { Movie } from '../types/movie';

const DISLIKED_MOVIES_KEY = 'cinematch_disliked_movies';

export interface DislikedMovie extends Movie {
  id: string;
  dislikedAt: string;
}

// Generate unique ID for movies
const generateMovieId = (movie: Movie): string => {
  return btoa(movie.name + movie.genre).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
};

// Get all disliked movies
export const getDislikedMovies = (): DislikedMovie[] => {
  try {
    const disliked = localStorage.getItem(DISLIKED_MOVIES_KEY);
    return disliked ? JSON.parse(disliked) : [];
  } catch (error) {
    console.error('Error loading disliked movies:', error);
    return [];
  }
};

// Mark a movie as disliked
export const markAsDisliked = (movie: Movie): boolean => {
  try {
    const dislikedMovies = getDislikedMovies();
    const movieId = generateMovieId(movie);
    
    // Check if already disliked
    if (dislikedMovies.some(disliked => disliked.id === movieId)) {
      return false; // Already disliked
    }
    
    const dislikedMovie: DislikedMovie = {
      ...movie,
      id: movieId,
      dislikedAt: new Date().toISOString(),
    };
    
    dislikedMovies.unshift(dislikedMovie); // Add to beginning
    localStorage.setItem(DISLIKED_MOVIES_KEY, JSON.stringify(dislikedMovies));
    return true;
  } catch (error) {
    console.error('Error marking movie as disliked:', error);
    return false;
  }
};

// Remove a movie from disliked list
export const removeFromDisliked = (movieId: string): boolean => {
  try {
    const dislikedMovies = getDislikedMovies();
    const filteredMovies = dislikedMovies.filter(movie => movie.id !== movieId);
    localStorage.setItem(DISLIKED_MOVIES_KEY, JSON.stringify(filteredMovies));
    return true;
  } catch (error) {
    console.error('Error removing disliked movie:', error);
    return false;
  }
};

// Check if a movie is disliked
export const isMovieDisliked = (movie: Movie): boolean => {
  const movieId = generateMovieId(movie);
  const dislikedMovies = getDislikedMovies();
  return dislikedMovies.some(disliked => disliked.id === movieId);
};

// Clear all disliked movies
export const clearAllDislikedMovies = (): void => {
  localStorage.removeItem(DISLIKED_MOVIES_KEY);
};

// Get disliked movies count
export const getDislikedMoviesCount = (): number => {
  return getDislikedMovies().length;
};