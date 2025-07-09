import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ExternalLink } from 'lucide-react';
import { Movie } from '../types/movie';

interface RecommendationButtonProps {
  movie: Movie;
  className?: string;
}

const RecommendationButton: React.FC<RecommendationButtonProps> = ({ movie, className = '' }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRecommendation = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    setIsLoading(true);
    
    try {
      // Navigate to recommendations page with movie title as parameter
      navigate(`/recommendations?based_on=${encodeURIComponent(movie.name)}`);
    } catch (error) {
      console.error('Error opening recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleRecommendation}
      disabled={isLoading}
      className={`group relative p-2 rounded-lg transition-all duration-200 ${
        isLoading 
          ? 'text-purple-300 bg-purple-500/20 cursor-not-allowed' 
          : 'text-[#9cabba] hover:text-purple-400 hover:bg-purple-500/10'
      } ${className}`}
      title="Get recommendations based on this movie"
    >
      <div className={`transition-transform duration-300 ${isLoading ? 'animate-spin' : 'group-hover:scale-110'}`}>
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
        ) : (
          <Sparkles size={20} />
        )}
      </div>
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none flex items-center gap-1">
        <span>Get recommendations</span>
      </div>
    </button>
  );
};

export default RecommendationButton;