import { Movie } from '../types/movie';

const SAVED_MOVIES_KEY = 'cinematch_saved_movies';
const STORAGE_PERMISSION_KEY = 'cinematch_storage_permission';

export interface SavedMovie extends Movie {
  id: string;
  savedAt: string;
}

// Check if storage is enabled
export const isStorageEnabled = (): boolean => {
  return localStorage.getItem(STORAGE_PERMISSION_KEY) === 'true';
};

// Enable/disable storage
export const setStoragePermission = (enabled: boolean): void => {
  localStorage.setItem(STORAGE_PERMISSION_KEY, enabled.toString());
  
  // If disabled, clear all saved movies
  if (!enabled) {
    localStorage.removeItem(SAVED_MOVIES_KEY);
  }
};

// Generate unique ID for movies
const generateMovieId = (movie: Movie): string => {
  return btoa(movie.name + movie.genre).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
};

// Get all saved movies
export const getSavedMovies = (): SavedMovie[] => {
  if (!isStorageEnabled()) return [];
  
  try {
    const saved = localStorage.getItem(SAVED_MOVIES_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error loading saved movies:', error);
    return [];
  }
};

// Save a movie
export const saveMovie = (movie: Movie): boolean => {
  if (!isStorageEnabled()) return false;
  
  try {
    const savedMovies = getSavedMovies();
    const movieId = generateMovieId(movie);
    
    // Check if already saved
    if (savedMovies.some(saved => saved.id === movieId)) {
      return false; // Already saved
    }
    
    const savedMovie: SavedMovie = {
      ...movie,
      id: movieId,
      savedAt: new Date().toISOString(),
    };
    
    savedMovies.unshift(savedMovie); // Add to beginning
    localStorage.setItem(SAVED_MOVIES_KEY, JSON.stringify(savedMovies));
    return true;
  } catch (error) {
    console.error('Error saving movie:', error);
    return false;
  }
};

// Remove a saved movie
export const removeSavedMovie = (movieId: string): boolean => {
  if (!isStorageEnabled()) return false;
  
  try {
    const savedMovies = getSavedMovies();
    const filteredMovies = savedMovies.filter(movie => movie.id !== movieId);
    localStorage.setItem(SAVED_MOVIES_KEY, JSON.stringify(filteredMovies));
    return true;
  } catch (error) {
    console.error('Error removing saved movie:', error);
    return false;
  }
};

// Check if a movie is saved
export const isMovieSaved = (movie: Movie): boolean => {
  if (!isStorageEnabled()) return false;
  
  const movieId = generateMovieId(movie);
  const savedMovies = getSavedMovies();
  return savedMovies.some(saved => saved.id === movieId);
};

// Clear all saved movies
export const clearAllSavedMovies = (): void => {
  localStorage.removeItem(SAVED_MOVIES_KEY);
};

// Get saved movies count
export const getSavedMoviesCount = (): number => {
  return getSavedMovies().length;
};