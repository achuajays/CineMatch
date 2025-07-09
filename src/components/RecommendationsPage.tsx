import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Star, Calendar, Clock, ExternalLink, Loader2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;
const Recommendation_API_URL = `${API_URL}/omdb/recommendations`;
console.log("Recommendation API URL:", Recommendation_API_URL);

interface RecommendedMovie {
  title: string;
  year: string;
  imdbRating: string;
  genre: string;
  actors: string;
  plot: string;
  poster: string;
}

const RecommendationsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const basedOn = searchParams.get('based_on') || '';
  
  const [recommendations, setRecommendations] = useState<RecommendedMovie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (basedOn) {
      fetchRecommendations(basedOn);
    }
  }, [basedOn]);

  const fetchRecommendations = async (movieTitle: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(Recommendation_API_URL, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: movieTitle
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: RecommendedMovie[] = await response.json();
      setRecommendations(data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setError('Failed to load recommendations. Please try again.');
      
      // Fallback recommendations
      setRecommendations([
        {
          title: "The Shawshank Redemption",
          year: "1994",
          imdbRating: "9.3",
          genre: "Drama",
          actors: "Tim Robbins, Morgan Freeman, Bob Gunton",
          plot: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
          poster: "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=1"
        },
        {
          title: "The Godfather",
          year: "1972",
          imdbRating: "9.2",
          genre: "Crime, Drama",
          actors: "Marlon Brando, Al Pacino, James Caan",
          plot: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
          poster: "https://images.pexels.com/photos/7991319/pexels-photo-7991319.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=1"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMovieClick = (movie: RecommendedMovie) => {
    // Navigate to a detailed view for the recommended movie
    navigate(`/movie-recommendation/${encodeURIComponent(movie.title)}`, { 
      state: { movie } 
    });
  };

  const closeWindow = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#111418] text-white overflow-x-hidden" style={{ fontFamily: '"Space Grotesk", "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#283039] px-4 md:px-10 py-3 bg-[#111418]/95 backdrop-blur-md">
          <div className="flex items-center gap-4 text-white">
            <div className="size-8 md:size-10">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z"
                  fill="currentColor"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M39.998 12.236C39.9944 12.2537 39.9875 12.2845 39.9748 12.3294C39.9436 12.4399 39.8949 12.5741 39.8346 12.7175C39.8168 12.7597 39.7989 12.8007 39.7813 12.8398C38.5103 13.7113 35.9788 14.9393 33.7095 15.4811C30.9875 16.131 27.6413 16.5217 24 16.5217C20.3587 16.5217 17.0125 16.131 14.2905 15.4811C12.0012 14.9346 9.44505 13.6897 8.18538 12.8168C8.17384 12.7925 8.16216 12.767 8.15052 12.7408C8.09919 12.6249 8.05721 12.5114 8.02977 12.411C8.00356 12.3152 8.00039 12.2667 8.00004 12.2612C8.00004 12.261 8 12.2607 8.00004 12.2612C8.00004 12.2359 8.0104 11.9233 8.68485 11.3686C9.34546 10.8254 10.4222 10.2469 11.9291 9.72276C14.9242 8.68098 19.1919 8 24 8C28.8081 8 33.0758 8.68098 36.0709 9.72276C37.5778 10.2469 38.6545 10.8254 39.3151 11.3686C39.9006 11.8501 39.9857 12.1489 39.998 12.236ZM4.95178 15.2312L21.4543 41.6973C22.6288 43.5809 25.3712 43.5809 26.5457 41.6973L43.0534 15.223C43.0709 15.1948 43.0878 15.1662 43.104 15.1371L41.3563 14.1648C43.104 15.1371 43.1038 15.1374 43.104 15.1371L43.1051 15.135L43.1065 15.1325L43.1101 15.1261L43.1199 15.1082C43.1276 15.094 43.1377 15.0754 43.1497 15.0527C43.1738 15.0075 43.2062 14.9455 43.244 14.8701C43.319 14.7208 43.4196 14.511 43.5217 14.2683C43.6901 13.8679 44 13.0689 44 12.2609C44 10.5573 43.003 9.22254 41.8558 8.2791C40.6947 7.32427 39.1354 6.55361 37.385 5.94477C33.8654 4.72057 29.133 4 24 4C18.867 4 14.1346 4.72057 10.615 5.94478C8.86463 6.55361 7.30529 7.32428 6.14419 8.27911C4.99695 9.22255 3.99999 10.5573 3.99999 12.2609C3.99999 13.1275 4.29264 13.9078 4.49321 14.3607C4.60375 14.6102 4.71348 14.8196 4.79687 14.9689C4.83898 15.0444 4.87547 15.1065 4.9035 15.1529C4.91754 15.1762 4.92954 15.1957 4.93916 15.2111L4.94662 15.223L4.95178 15.2312ZM35.9868 18.996L24 38.22L12.0131 18.996C12.4661 19.1391 12.9179 19.2658 13.3617 19.3718C16.4281 20.1039 20.0901 20.5217 24 20.5217C27.9099 20.5217 31.5719 20.1039 34.6383 19.3718C35.082 19.2658 35.5339 19.1391 35.9868 18.996Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h1 className="text-white text-xl md:text-2xl font-bold leading-tight tracking-[-0.015em] bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
              CineMatch Recommendations
            </h1>
          </div>
          
          <button
            onClick={closeWindow}
            className="flex items-center gap-2 bg-[#283039] hover:bg-[#3a424d] text-white px-4 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="hidden md:inline">Back</span>
          </button>
        </header>

        {/* Main Content */}
        <div className="px-4 md:px-10 lg:px-20 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-full max-w-7xl">
            {/* Header Section */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-full flex items-center justify-center mb-4 border border-purple-400/30">
                <Sparkles className="w-8 h-8 text-purple-400" />
              </div>
              
              <h2 className="text-white text-2xl md:text-3xl font-bold mb-2">
                Recommendations Based On
              </h2>
              <p className="text-purple-400 text-xl font-semibold mb-2">"{basedOn}"</p>
              <p className="text-[#9cabba] text-base max-w-2xl">
                Discover movies similar to your taste with our AI-powered recommendation engine
              </p>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="w-12 h-12 text-purple-400 animate-spin mb-4" />
                <p className="text-[#9cabba] text-lg">Finding perfect recommendations for you...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ExternalLink className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-white text-xl font-bold mb-2">Oops! Something went wrong</h3>
                <p className="text-[#9cabba] text-base mb-6">{error}</p>
                <button
                  onClick={() => fetchRecommendations(basedOn)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Recommendations Grid */}
            {!isLoading && !error && recommendations.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recommendations.map((movie, index) => (
                  <div
                    key={index}
                    className="group bg-gradient-to-br from-[#283039] to-[#1e252b] rounded-xl overflow-hidden hover:from-[#3a424d] hover:to-[#2a3138] transition-all duration-300 cursor-pointer transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10"
                    onClick={() => handleMovieClick(movie)}
                  >
                    {/* Movie Poster */}
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img
                        src={movie.poster}
                        alt={`${movie.title} poster`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://images.pexels.com/photos/796206/pexels-photo-796206.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=1`;
                        }}
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Rating Badge */}
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{movie.imdbRating}</span>
                      </div>

                      {/* External Link Icon */}
                      <div className="absolute bottom-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ExternalLink className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    {/* Movie Info */}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-white text-lg font-bold leading-tight line-clamp-2 group-hover:text-purple-400 transition-colors">
                          {movie.title}
                        </h3>
                        <span className="flex-shrink-0 text-[#9cabba] text-sm font-medium">
                          {movie.year}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                          {movie.genre.split(',')[0].trim()}
                        </span>
                        <div className="flex items-center gap-1 text-[#9cabba] text-xs">
                          <Calendar className="w-3 h-3" />
                          <span>{movie.year}</span>
                        </div>
                      </div>
                      
                      <p className="text-[#9cabba] text-sm leading-relaxed line-clamp-3 mb-3">
                        {movie.plot}
                      </p>
                      
                      <div className="text-[#9cabba] text-xs">
                        <p className="font-medium mb-1">Starring:</p>
                        <p className="line-clamp-2">{movie.actors}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && recommendations.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-[#283039] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-[#9cabba]" />
                </div>
                <h3 className="text-white text-xl font-bold mb-2">No recommendations found</h3>
                <p className="text-[#9cabba] text-base">
                  We couldn't find any recommendations for "{basedOn}". Try with a different movie.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationsPage;