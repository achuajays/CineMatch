import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { getMovieRecommendations } from '../services/groqService';
import { Movie } from '../types/movie';
import { getSavedMovies } from '../services/storageService';
import { getWatchedMovies } from '../services/watchedMoviesService';
import { getDislikedMovies } from '../services/dislikedMoviesService';

interface SearchSectionProps {
  onMoviesFound: (movies: Movie[], query: string) => void;
  onLoadingChange: (loading: boolean) => void;
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
}

const SearchSection: React.FC<SearchSectionProps> = ({ 
  onMoviesFound, 
  onLoadingChange, 
  searchQuery: externalSearchQuery = '',
  onSearchQueryChange 
}) => {
  const [searchQuery, setSearchQuery] = useState(externalSearchQuery);
  const [isLoading, setIsLoading] = useState(false);

  // Update internal state when external query changes
  React.useEffect(() => {
    setSearchQuery(externalSearchQuery);
  }, [externalSearchQuery]);

  const updateSearchQuery = (value: string) => {
    setSearchQuery(value);
    if (onSearchQueryChange) {
      onSearchQueryChange(value);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    // Check if API key is configured
    const apiKey = localStorage.getItem('groq_api_key');
    if (!apiKey) {
      alert('Please configure your Groq API key in settings first.');
      return;
    }
    
    setIsLoading(true);
    onLoadingChange(true);
    
    try {
      const movies = await getMovieRecommendations(searchQuery);
      
      // Additional client-side filtering as backup
      const savedMovies = getSavedMovies();
      const watchedMovies = getWatchedMovies();
      const dislikedMovies = getDislikedMovies();
      const existingMovieNames = new Set([
        ...savedMovies.map(m => m.name.toLowerCase()),
        ...watchedMovies.map(m => m.name.toLowerCase()),
        ...dislikedMovies.map(m => m.name.toLowerCase())
      ]);
      
      const filteredMovies = movies.filter(movie => 
        !existingMovieNames.has(movie.name.toLowerCase())
      );
      
      onMoviesFound(movies, searchQuery);
    } catch (error) {
      console.error('Search failed:', error);
      onMoviesFound([], searchQuery);
    } finally {
      setIsLoading(false);
      onLoadingChange(false);
    }
  };

  return (
    <div className="flex flex-col items-center py-16 bg-gradient-to-b from-transparent to-[#111418]">
      <h2 className="text-white tracking-light text-2xl md:text-3xl lg:text-4xl font-bold leading-tight px-4 text-center pb-3 pt-5">
        Find Your Perfect Movie
      </h2>
      <p className="text-white text-base md:text-lg font-normal leading-normal pb-6 pt-1 px-4 text-center max-w-2xl">
        Ask me anything about movies, and I'll help you find the perfect one for your mood.
      </p>
      <form onSubmit={handleSearch} className="flex max-w-[600px] w-full items-center gap-4 px-4 py-3 relative z-10">
        <div className="flex flex-1 relative">
          <input
            type="text"
            placeholder="What kind of movie are you looking for?"
            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-2 focus:ring-blue-500 border-none bg-[#283039]/80 backdrop-blur-sm h-14 placeholder:text-[#9cabba] p-4 pr-12 text-base font-normal leading-normal transition-all disabled:opacity-50 shadow-2xl"
            value={searchQuery}
            onChange={(e) => updateSearchQuery(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-[#9cabba] hover:text-white transition-colors disabled:opacity-50"
            disabled={isLoading || !searchQuery.trim()}
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Search size={20} />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchSection;