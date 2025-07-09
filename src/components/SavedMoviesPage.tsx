import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Calendar, Clock, Star, Search, Bell } from 'lucide-react';
import { getSavedMovies, removeSavedMovie, isStorageEnabled, SavedMovie } from '../services/storageService';
import { getMovieImage } from '../services/imageService';

const SavedMoviesPage: React.FC = () => {
  const navigate = useNavigate();
  const [savedMovies, setSavedMovies] = useState<SavedMovie[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMovies, setFilteredMovies] = useState<SavedMovie[]>([]);
  const [movieImages, setMovieImages] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isStorageEnabled()) {
      navigate('/');
      return;
    }
    
    const movies = getSavedMovies();
    setSavedMovies(movies);
    setFilteredMovies(movies);
  }, [navigate]);

  // Load images for all movies
  useEffect(() => {
    const loadImages = async () => {
      const imagePromises = savedMovies.map(async (movie) => {
        try {
          const imageUrl = await getMovieImage(movie.name);
          return { id: movie.id, url: imageUrl };
        } catch (error) {
          return { id: movie.id, url: getPosterUrl(movie.id) };
        }
      });

      const results = await Promise.allSettled(imagePromises);
      const imageMap: Record<string, string> = {};
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          imageMap[result.value.id] = result.value.url;
        } else {
          imageMap[savedMovies[index].id] = getPosterUrl(savedMovies[index].id);
        }
      });

      setMovieImages(imageMap);
    };

    if (savedMovies.length > 0) {
      loadImages();
    }
  }, [savedMovies]);
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = savedMovies.filter(movie =>
        movie.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.smallDescription.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMovies(filtered);
    } else {
      setFilteredMovies(savedMovies);
    }
  }, [searchQuery, savedMovies]);

  const handleRemoveMovie = (movieId: string) => {
    if (removeSavedMovie(movieId)) {
      const updatedMovies = savedMovies.filter(movie => movie.id !== movieId);
      setSavedMovies(updatedMovies);
    }
  };

  const handleMovieClick = (movie: SavedMovie) => {
    // Find the movie index in the original movies array for navigation
    // For now, we'll navigate to a generic details page
    navigate(`/saved-movie/${movie.id}`, { state: { movie } });
  };

  const getPosterUrl = (movieId: string) => {
    const movieImages = [
      "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=1",
      "https://images.pexels.com/photos/7991319/pexels-photo-7991319.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=1",
      "https://images.pexels.com/photos/796206/pexels-photo-796206.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=1",
      "https://images.pexels.com/photos/7991622/pexels-photo-7991622.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=1",
      "https://images.pexels.com/photos/33129/popcorn-movie-party-entertainment.jpg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=1"
    ];
    const index = movieId.charCodeAt(0) % movieImages.length;
    return movieImages[index];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#111418] text-white overflow-x-hidden" style={{ fontFamily: '"Space Grotesk", "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#283039] px-4 md:px-10 py-3">
          <div className="flex items-center gap-8">
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
              <h2 className="text-white text-lg md:text-xl font-bold leading-tight tracking-[-0.015em]">CineMatch</h2>
            </div>
            <div className="hidden md:flex items-center gap-9">
              <button 
                onClick={() => navigate('/')}
                className="text-white text-sm font-medium leading-normal hover:text-blue-400 transition-colors flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                Home
              </button>
              <a className="text-blue-400 text-sm font-medium leading-normal" href="#">Saved</a>
              <a className="text-white text-sm font-medium leading-normal hover:text-blue-400 transition-colors" href="#">Profile</a>
            </div>
          </div>
          <div className="flex flex-1 justify-end gap-4 md:gap-8">
            <label className="hidden md:flex flex-col min-w-40 !h-10 max-w-64">
              <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                <div className="text-[#a2abb3] flex border-none bg-[#283039] items-center justify-center pl-4 rounded-l-xl border-r-0">
                  <Search size={20} />
                </div>
                <input
                  placeholder="Search saved movies"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border-none bg-[#283039] focus:border-none h-full placeholder:text-[#a2abb3] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                />
              </div>
            </label>
            <button className="flex cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 bg-[#283039] text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5 hover:bg-[#3a424d] transition-colors">
              <Bell size={20} />
            </button>
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 hover:ring-2 hover:ring-white/20 transition-all cursor-pointer"
              style={{
                backgroundImage: 'url("https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1")'
              }}
            />
          </div>
        </header>

        {/* Main Content */}
        <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            {/* Back Button for Mobile */}
            <button 
              onClick={() => navigate('/')}
              className="md:hidden flex items-center gap-2 text-white mb-4 hover:text-blue-400 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Home
            </button>

            {/* Header */}
            <div className="flex flex-wrap justify-between items-center gap-3 p-4">
              <div>
                <h1 className="text-white tracking-light text-2xl md:text-3xl font-bold leading-tight">
                  Saved Movies
                </h1>
                <p className="text-[#9cabba] text-sm mt-1">
                  {filteredMovies.length} {filteredMovies.length === 1 ? 'movie' : 'movies'} in your collection
                </p>
              </div>
            </div>

            {/* Mobile Search */}
            <div className="md:hidden px-4 mb-4">
              <div className="flex w-full items-stretch rounded-xl h-12">
                <div className="text-[#a2abb3] flex border-none bg-[#283039] items-center justify-center pl-4 rounded-l-xl border-r-0">
                  <Search size={20} />
                </div>
                <input
                  placeholder="Search saved movies"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border-none bg-[#283039] focus:border-none h-full placeholder:text-[#a2abb3] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                />
              </div>
            </div>

            {/* Movies List */}
            {filteredMovies.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-[#283039] rounded-full flex items-center justify-center">
                  <Star size={32} className="text-[#9cabba]" />
                </div>
                <h3 className="text-white text-xl font-bold mb-2">
                  {searchQuery ? 'No movies found' : 'No saved movies yet'}
                </h3>
                <p className="text-[#9cabba] text-base mb-6">
                  {searchQuery 
                    ? 'Try adjusting your search terms' 
                    : 'Start exploring and save movies you want to watch later'
                  }
                </p>
                {!searchQuery && (
                  <button 
                    onClick={() => navigate('/')}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Discover Movies
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMovies.map((movie) => (
                  <div 
                    key={movie.id}
                    className="group flex items-center gap-4 bg-[#283039] hover:bg-[#3a424d] px-4 py-4 rounded-xl transition-all duration-300 cursor-pointer"
                  >
                    {/* Movie Poster */}
                    <div 
                      className="aspect-square rounded-lg size-16 md:size-20 flex-shrink-0 group-hover:scale-105 transition-transform duration-300 overflow-hidden"
                      onClick={() => handleMovieClick(movie)}
                    >
                      {movieImages[movie.id] ? (
                        <img 
                          src={movieImages[movie.id]} 
                          alt={`${movie.name} poster`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = getPosterUrl(movie.id);
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#283039] to-[#1e252b] flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                        </div>
                      )}
                    </div>
                    
                    {/* Movie Info */}
                    <div 
                      className="flex flex-col justify-center flex-1 min-w-0"
                      onClick={() => handleMovieClick(movie)}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="text-white text-base md:text-lg font-bold leading-tight line-clamp-1 group-hover:text-blue-400 transition-colors">
                          {movie.name}
                        </h3>
                        <span className="flex-shrink-0 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                          {movie.genre}
                        </span>
                      </div>
                      
                      <p className="text-[#9cabba] text-sm md:text-base font-normal leading-normal line-clamp-2 mb-2">
                        {movie.smallDescription}
                      </p>
                      
                      <div className="flex items-center gap-4 text-[#9cabba] text-xs">
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          <span>Saved {formatDate(movie.savedAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          <span>{Math.floor(90 + Math.random() * 60)}m</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star size={12} />
                          <span>{(8.0 + Math.random() * 2).toFixed(1)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveMovie(movie.id);
                      }}
                      className="flex-shrink-0 p-2 text-[#9cabba] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                      title="Remove from saved"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedMoviesPage;