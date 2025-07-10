import React, { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { Movie } from '../types/movie';
import { saveMovie, removeSavedMovie, isMovieSaved, isStorageEnabled } from '../services/storageService';
import { useToast } from '../hooks/useToast';

interface SaveButtonProps {
  movie: Movie;
  className?: string;
}

const SaveButton: React.FC<SaveButtonProps> = ({ movie, className = '' }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { showWarning } = useToast();

  useEffect(() => {
    setIsSaved(isMovieSaved(movie));
  }, [movie]);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isStorageEnabled()) {
      showWarning('Storage Disabled', 'Please enable storage in settings to save movies.');
      return;
    }

    setIsAnimating(true);
    
    if (isSaved) {
      // Remove from saved
      const movieId = btoa(movie.name + movie.genre).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
      if (removeSavedMovie(movieId)) {
        setIsSaved(false);
      }
    } else {
      // Save movie
      if (saveMovie(movie)) {
        setIsSaved(true);
      }
    }

    setTimeout(() => setIsAnimating(false), 300);
  };

  if (!isStorageEnabled()) {
    return null;
  }

  return (
    <button
      onClick={handleSave}
      className={`group relative p-2 rounded-lg transition-all duration-200 ${
        isSaved 
          ? 'text-blue-400 bg-blue-500/10 hover:bg-blue-500/20' 
          : 'text-[#9cabba] hover:text-blue-400 hover:bg-blue-500/10'
      } ${className}`}
      title={isSaved ? 'Remove from saved' : 'Save movie'}
    >
      <div className={`transition-transform duration-300 ${isAnimating ? 'scale-125' : 'scale-100'}`}>
        {isSaved ? (
          <BookmarkCheck size={20} className="fill-current" />
        ) : (
          <Bookmark size={20} />
        )}
      </div>
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
        {isSaved ? 'Remove from saved' : 'Save movie'}
      </div>
    </button>
  );
};

export default SaveButton;