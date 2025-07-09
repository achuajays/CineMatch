import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Check } from 'lucide-react';
import { Movie } from '../types/movie';
import { markAsWatched, removeFromWatched, isMovieWatched } from '../services/watchedMoviesService';

interface WatchedButtonProps {
  movie: Movie;
  className?: string;
}

const WatchedButton: React.FC<WatchedButtonProps> = ({ movie, className = '' }) => {
  const [isWatched, setIsWatched] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setIsWatched(isMovieWatched(movie));
  }, [movie]);

  const handleWatchedToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    setIsAnimating(true);
    
    if (isWatched) {
      // Remove from watched
      const movieId = btoa(movie.name + movie.genre).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
      if (removeFromWatched(movieId)) {
        setIsWatched(false);
      }
    } else {
      // Mark as watched
      if (markAsWatched(movie)) {
        setIsWatched(true);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      }
    }

    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <div className="relative">
      <button
        onClick={handleWatchedToggle}
        className={`group relative p-2 rounded-lg transition-all duration-200 ${
          isWatched 
            ? 'text-green-400 bg-green-500/10 hover:bg-green-500/20' 
            : 'text-[#9cabba] hover:text-green-400 hover:bg-green-500/10'
        } ${className}`}
        title={isWatched ? 'Mark as unwatched' : 'Mark as watched'}
      >
        <div className={`transition-transform duration-300 ${isAnimating ? 'scale-125' : 'scale-100'}`}>
          {isWatched ? (
            <Eye size={20} className="fill-current" />
          ) : (
            <EyeOff size={20} />
          )}
        </div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
          {isWatched ? 'Mark as unwatched' : 'Mark as watched'}
        </div>
      </button>

      {/* Success notification */}
      {showSuccess && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 animate-fade-in">
          <Check size={12} />
          <span>Watched!</span>
        </div>
      )}
    </div>
  );
};

export default WatchedButton;