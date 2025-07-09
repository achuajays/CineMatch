import React, { useState, useEffect } from 'react';
import { ThumbsDown, X } from 'lucide-react';
import { Movie } from '../types/movie';
import { markAsDisliked, removeFromDisliked, isMovieDisliked } from '../services/dislikedMoviesService';

interface DislikeButtonProps {
  movie: Movie;
  className?: string;
}

const DislikeButton: React.FC<DislikeButtonProps> = ({ movie, className = '' }) => {
  const [isDisliked, setIsDisliked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setIsDisliked(isMovieDisliked(movie));
  }, [movie]);

  const handleDislikeToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    setIsAnimating(true);
    
    if (isDisliked) {
      // Remove from disliked
      const movieId = btoa(movie.name + movie.genre).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
      if (removeFromDisliked(movieId)) {
        setIsDisliked(false);
      }
    } else {
      // Mark as disliked
      if (markAsDisliked(movie)) {
        setIsDisliked(true);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      }
    }

    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <div className="relative">
      <button
        onClick={handleDislikeToggle}
        className={`group relative p-2 rounded-lg transition-all duration-200 ${
          isDisliked 
            ? 'text-red-400 bg-red-500/10 hover:bg-red-500/20' 
            : 'text-[#9cabba] hover:text-red-400 hover:bg-red-500/10'
        } ${className}`}
        title={isDisliked ? 'Remove dislike' : 'Dislike movie'}
      >
        <div className={`transition-transform duration-300 ${isAnimating ? 'scale-125' : 'scale-100'}`}>
          {isDisliked ? (
            <ThumbsDown size={20} className="fill-current" />
          ) : (
            <ThumbsDown size={20} />
          )}
        </div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
          {isDisliked ? 'Remove dislike' : 'Dislike movie'}
        </div>
      </button>

      {/* Success notification */}
      {showSuccess && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 animate-fade-in">
          <X size={12} />
          <span>Disliked!</span>
        </div>
      )}
    </div>
  );
};

export default DislikeButton;