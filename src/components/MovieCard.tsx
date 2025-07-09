import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Clock, Calendar, ArrowRight } from 'lucide-react';
import { Movie } from '../types/movie';
import SaveButton from './SaveButton';
import WatchedButton from './WatchedButton';
import DislikeButton from './DislikeButton';
import { getMovieImage } from '../services/imageService';

interface MovieCardProps {
  movie: Movie;
  index: number;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, index }) => {
  const navigate = useNavigate();
  const [posterUrl, setPosterUrl] = React.useState<string>('');
  const [imageLoading, setImageLoading] = React.useState(true);

  React.useEffect(() => {
    const loadImage = async () => {
      try {
        const imageUrl = await getMovieImage(movie.name);
        setPosterUrl(imageUrl);
      } catch (error) {
        console.error('Failed to load movie image:', error);
        // Fallback to default image
        setPosterUrl(getPosterUrl(index));
      } finally {
        setImageLoading(false);
      }
    };

    loadImage();
  }, [movie.name, index]);

  const handleClick = () => {
    navigate(`/movie/${index}`);
  };

  // Generate a movie poster URL based on the movie index
  const getPosterUrl = (movieIndex: number) => {
    const movieImages = [
      "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=1",
      "https://images.pexels.com/photos/7991319/pexels-photo-7991319.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=1",
      "https://images.pexels.com/photos/796206/pexels-photo-796206.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=1",
      "https://images.pexels.com/photos/7991622/pexels-photo-7991622.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=1",
      "https://images.pexels.com/photos/33129/popcorn-movie-party-entertainment.jpg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=1"
    ];
    return movieImages[movieIndex % movieImages.length];
  };

  return (
    <div 
      className="group relative bg-gradient-to-br from-[#283039] to-[#1e252b] rounded-2xl overflow-hidden hover:from-[#3a424d] hover:to-[#2a3138] transition-all duration-500 cursor-pointer transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10"
      onClick={handleClick}
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-500 rounded-2xl" />
      
      <div className="relative flex flex-col md:flex-row gap-6 p-6">
        {/* Movie Poster */}
        <div className="relative flex-shrink-0">
          <div className="w-full md:w-32 lg:w-40 h-48 md:h-48 lg:h-56 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 relative overflow-hidden">
            {imageLoading ? (
              <div className="w-full h-full bg-gradient-to-br from-[#283039] to-[#1e252b] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <img 
                src={posterUrl} 
                alt={`${movie.name} poster`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to default image if API image fails to load
                  const target = e.target as HTMLImageElement;
                  target.src = getPosterUrl(index);
                }}
              />
            )}
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-xl" />
            
            {/* Play button overlay */}
            {!imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                  <ArrowRight className="w-5 h-5 text-white ml-0.5" />
                </div>
              </div>
            )}
          </div>
          
          {/* Rating badge */}
          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" />
            <span>{(8.5 + Math.random() * 1.5).toFixed(1)}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between min-h-0">
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-white text-xl lg:text-2xl font-bold leading-tight group-hover:text-blue-400 transition-colors line-clamp-2">
                {movie.name}
              </h3>
              <span className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                {movie.genre}
              </span>
            </div>
            
            {/* Movie meta info */}
            <div className="flex items-center gap-4 text-[#9cabba] text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>2023</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{Math.floor(90 + Math.random() * 60)}m</span>
              </div>
            </div>
            
            <p className="text-[#9cabba] text-sm lg:text-base font-medium leading-relaxed line-clamp-2">
              {movie.smallDescription}
            </p>
          </div>
          
          {/* Description */}
          <div className="space-y-4 mt-4">
            <p className="text-[#c5d1db] text-sm lg:text-base leading-relaxed line-clamp-3">
              {movie.bigDescription}
            </p>
            
            {/* Synopsis preview */}
            <div className="pt-4 border-t border-[#3a424d]/50">
              <p className="text-[#9cabba] text-xs lg:text-sm leading-relaxed line-clamp-2">
                {movie.synopsis}
              </p>
            </div>
          </div>

          {/* Action footer */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#3a424d]/30">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-[#9cabba] text-xs">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Available now</span>
              </div>
              <SaveButton movie={movie} />
              <WatchedButton movie={movie} />
              <DislikeButton movie={movie} />
            </div>
            
            <div className="flex items-center gap-2 text-blue-400 text-sm font-medium group-hover:text-blue-300 transition-colors">
              <span>View Details</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Hover border effect */}
      <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-blue-500/20 transition-all duration-300 pointer-events-none" />
    </div>
  );
};

export default MovieCard;