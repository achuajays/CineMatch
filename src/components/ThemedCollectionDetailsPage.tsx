import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Search, Bell, Film, Users, Calendar, Globe, Lock, Plus, Trash2, ExternalLink } from 'lucide-react';
import { 
  ThemedCollection, 
  CollectionMovie, 
  getCollectionById, 
  getCollectionMovies,
  removeMovieFromCollection,
  canEditCollection 
} from '../services/themedCollectionsService';
import { getMovieImage } from '../services/imageService';
import AddMovieToCollectionModal from './AddMovieToCollectionModal';

const ThemedCollectionDetailsPage: React.FC = () => {
  const { collectionId } = useParams<{ collectionId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [collection, setCollection] = useState<ThemedCollection | null>(location.state?.collection || null);
  const [movies, setMovies] = useState<CollectionMovie[]>([]);
  const [movieImages, setMovieImages] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [canEdit, setCanEdit] = useState(false);
  const [isAddMovieModalOpen, setIsAddMovieModalOpen] = useState(false);
  const [collectionCoverUrl, setCollectionCoverUrl] = useState<string>('');

  useEffect(() => {
    if (collectionId) {
      loadCollectionData();
    }
  }, [collectionId]);

  useEffect(() => {
    if (movies.length > 0) {
      loadMovieImages();
    }
  }, [movies]);

  // Load collection cover image
  useEffect(() => {
    const loadCollectionCover = async () => {
      if (collection) {
        if (collection.cover_image) {
          setCollectionCoverUrl(collection.cover_image);
        } else if (movies.length > 0) {
          try {
            const imageUrl = await getMovieImage(movies[0].movie_name);
            setCollectionCoverUrl(imageUrl);
          } catch (error) {
            console.error('Error loading movie image for collection cover:', error);
          }
        }
      }
    };

    loadCollectionCover();
  }, [collection, movies]);
  const loadCollectionData = async () => {
    if (!collectionId) return;
    
    setIsLoading(true);
    try {
      const [collectionData, moviesData, editPermission] = await Promise.all([
        collection || getCollectionById(collectionId),
        getCollectionMovies(collectionId),
        canEditCollection(collectionId)
      ]);

      if (collectionData) {
        setCollection(collectionData);
      }
      setMovies(moviesData);
      setCanEdit(editPermission);
    } catch (error) {
      console.error('Error loading collection data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMovieImages = async () => {
    const imagePromises = movies.map(async (movie) => {
      try {
        const imageUrl = await getMovieImage(movie.movie_name);
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
        imageMap[movies[index].id] = getPosterUrl(movies[index].id);
      }
    });

    setMovieImages(imageMap);
  };

  const handleRemoveMovie = async (movieId: string) => {
    if (window.confirm('Are you sure you want to remove this movie from the collection?')) {
      const success = await removeMovieFromCollection(movieId);
      if (success) {
        setMovies(prev => prev.filter(m => m.id !== movieId));
        if (collection) {
          setCollection(prev => prev ? { ...prev, movie_count: (prev.movie_count || 1) - 1 } : null);
        }
      }
    }
  };

  const handleMovieClick = (movie: CollectionMovie) => {
    const imdbUrl = `https://www.imdb.com/find/?q=${encodeURIComponent(movie.movie_name)}`;
    window.open(imdbUrl, '_blank');
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
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#111518] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-[#111518] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Collection not found</h1>
          <button 
            onClick={() => navigate('/themed-collections')}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Back to Collections
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#111518] text-white overflow-x-hidden" style={{ fontFamily: '"Space Grotesk", "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#283039] px-4 md:px-10 py-3">
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
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/themed-collections')}
              className="flex items-center gap-2 bg-[#283039] hover:bg-[#3a424d] text-white px-4 py-2 rounded-lg transition-colors"
            >
              <ArrowLeft size={16} />
              <span className="hidden md:inline">Back to Collections</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <div className="px-4 md:px-10 lg:px-20 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-full max-w-7xl">
            {/* Collection Header */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Cover Image */}
                <div className="w-full md:w-80 aspect-video rounded-xl overflow-hidden flex-shrink-0">
                  {collection.cover_image || collectionCoverUrl ? (
                    <img
                      src={collection.cover_image || collectionCoverUrl}
                      alt={collection.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center ${collection.cover_image || collectionCoverUrl ? 'hidden' : ''}`}>
                      <Film className="w-16 h-16 text-purple-400" />
                    </div>
                  )}
                </div>

                {/* Collection Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h1 className="text-white text-2xl md:text-3xl font-bold leading-tight">
                      {collection.title}
                    </h1>
                    <div className="flex items-center gap-2">
                      {collection.is_public ? (
                        <div className="flex items-center gap-1 bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-sm">
                          <Globe className="w-4 h-4" />
                          <span>Public</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 bg-yellow-600/20 text-yellow-400 px-3 py-1 rounded-full text-sm">
                          <Lock className="w-4 h-4" />
                          <span>Private</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {collection.description && (
                    <p className="text-[#9cabba] text-base leading-relaxed mb-4">
                      {collection.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-[#9cabba] text-sm mb-6">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{collection.creator_name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Created {formatDate(collection.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Film className="w-4 h-4" />
                      <span>{movies.length} movies</span>
                    </div>
                  </div>

                  {canEdit && (
                    <button
                      onClick={() => setIsAddMovieModalOpen(true)}
                      className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                    >
                      <Plus size={16} />
                      Add Movie
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Movies Grid */}
            {movies.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-[#283039] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Film className="w-8 h-8 text-[#9cabba]" />
                </div>
                <h3 className="text-white text-xl font-bold mb-2">No movies in this collection yet</h3>
                <p className="text-[#9cabba] text-base mb-6">
                  {canEdit ? 'Start building your collection by adding movies' : 'This collection is empty'}
                </p>
                {canEdit && (
                  <button
                    onClick={() => setIsAddMovieModalOpen(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                  >
                    Add First Movie
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {movies.map((movie) => (
                  <div
                    key={movie.id}
                    className="group bg-gradient-to-br from-[#283039] to-[#1e252b] rounded-xl overflow-hidden hover:from-[#3a424d] hover:to-[#2a3138] transition-all duration-300 cursor-pointer transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10"
                    onClick={() => handleMovieClick(movie)}
                  >
                    {/* Movie Poster */}
                    <div className="relative aspect-[3/4] overflow-hidden">
                      {movieImages[movie.id] ? (
                        <img
                          src={movieImages[movie.id]}
                          alt={`${movie.movie_name} poster`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = getPosterUrl(movie.id);
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#283039] to-[#1e252b] flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                        </div>
                      )}

                      {/* Remove Button (only for collection owner) */}
                      {canEdit && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveMovie(movie.id);
                          }}
                          className="absolute top-2 right-2 p-2 bg-black/60 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-600/80"
                        >
                          <Trash2 className="w-4 h-4 text-white" />
                        </button>
                      )}

                      {/* External Link Icon */}
                      <div className="absolute bottom-2 right-2 w-8 h-8 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ExternalLink className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    {/* Movie Info */}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-white text-base font-bold leading-tight line-clamp-2 group-hover:text-purple-400 transition-colors">
                          {movie.movie_name}
                        </h3>
                        <span className="flex-shrink-0 bg-purple-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                          {movie.movie_genre}
                        </span>
                      </div>
                      
                      {movie.movie_description && (
                        <p className="text-[#9cabba] text-sm leading-relaxed line-clamp-2">
                          {movie.movie_description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Movie Modal */}
      {canEdit && (
        <AddMovieToCollectionModal
          isOpen={isAddMovieModalOpen}
          onClose={() => setIsAddMovieModalOpen(false)}
          collectionId={collection.id}
          onSuccess={(newMovie) => {
            setMovies(prev => [...prev, newMovie]);
            setCollection(prev => prev ? { ...prev, movie_count: (prev.movie_count || 0) + 1 } : null);
            setIsAddMovieModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default ThemedCollectionDetailsPage;