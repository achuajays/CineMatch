import React from 'react';
import { Movie } from '../types/movie';
import MovieCard from './MovieCard';

interface MovieResultsProps {
  movies: Movie[];
  isLoading: boolean;
  searchQuery: string;
}

const MovieResults: React.FC<MovieResultsProps> = ({ movies, isLoading, searchQuery }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-[#9cabba] text-lg">Finding perfect movies for you...</p>
      </div>
    );
  }

  if (movies.length === 0 && searchQuery) {
    return (
      <div className="text-center py-12">
        <p className="text-[#9cabba] text-lg mb-2">No movies found</p>
        <p className="text-[#9cabba] text-sm">Try a different search term or mood</p>
      </div>
    );
  }

  if (movies.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 mb-16">
      <div className="mb-6">
        <h2 className="text-white text-2xl md:text-3xl font-bold mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Recommended for "{searchQuery}"
        </h2>
        <p className="text-[#9cabba] text-base">
          {movies.length} movies that match your vibe
        </p>
      </div>
      
      <div className="space-y-6 lg:space-y-8">
        {movies.map((movie, index) => (
          <MovieCard
            key={index}
            movie={movie}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default MovieResults;