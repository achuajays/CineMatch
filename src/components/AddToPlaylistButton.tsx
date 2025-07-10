import React, { useState, useEffect } from 'react';
import { Plus, List, Film, X, Globe, Lock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Movie } from '../types/movie';
import { 
  getUserCollections, 
  ThemedCollection, 
  addMovieToCollection,
  getCurrentUser,
  getCollectionMovies 
} from '../services/themedCollectionsService';
import CreateCollectionModal from './CreateCollectionModal';

interface AddToPlaylistButtonProps {
  movie: Movie;
  className?: string;
}

const AddToPlaylistButton: React.FC<AddToPlaylistButtonProps> = ({ movie, className = '' }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [collections, setCollections] = useState<ThemedCollection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  const [movieInCollections, setMovieInCollections] = useState<Set<string>>(new Set());

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    checkAuth();
  }, []);

  const handleButtonClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Check if user is authenticated
    if (!user) {
      navigate('/auth');
      return;
    }

    setIsModalOpen(true);
    await loadCollections();
  };

  const loadCollections = async () => {
    setIsLoading(true);
    setError('');
    const collectionsWithMovie = new Set<string>();
    
    try {
      const userCollections = await getUserCollections();
      setCollections(userCollections);
      
      // Check which collections already contain this movie
      for (const collection of userCollections) {
        try {
          const movies = await getCollectionMovies(collection.id);
          const hasMovie = movies.some(m => 
            m.movie_name.toLowerCase().trim() === movie.name.toLowerCase().trim()
          );
          if (hasMovie) {
            collectionsWithMovie.add(collection.id);
          }
        } catch (error) {
          console.error(`Error checking movies in collection ${collection.id}:`, error);
        }
      }
      
      setMovieInCollections(collectionsWithMovie);
    } catch (error) {
      console.error('Error loading collections:', error);
      setError('Failed to load collections');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCollection = async (collectionId: string) => {
    // Check if movie is already in this collection
    if (movieInCollections.has(collectionId)) {
      setError('This movie is already in the selected collection');
      return;
    }
    
    setIsAdding(collectionId);
    setError('');

    try {
      const success = await addMovieToCollection({
        collection_id: collectionId,
        movie: movie
      });

      if (success) {
        setIsModalOpen(false);
        // Show success feedback (you could add a toast here)
      } else {
        setError('Failed to add movie to collection. It may already exist.');
      }
    } catch (error) {
      console.error('Error adding movie to collection:', error);
      if (error instanceof Error && error.message.includes('duplicate')) {
        setError('This movie is already in the collection');
      } else {
        setError('An error occurred while adding the movie');
      }
    } finally {
      setIsAdding(null);
    }
  };

  const handleCreateNewCollection = () => {
    setIsModalOpen(false);
    setIsCreateModalOpen(true);
  };

  const handleCollectionCreated = (newCollection: ThemedCollection) => {
    setIsCreateModalOpen(false);
    // Automatically add the movie to the newly created collection
    handleAddToCollection(newCollection.id);
  };

  const closeModal = () => {
    if (!isAdding) {
      setIsModalOpen(false);
      setError('');
    }
  };

  return (
    <>
      <button
        onClick={handleButtonClick}
        className={`group relative p-2 rounded-lg transition-all duration-200 text-[#9cabba] hover:text-purple-400 hover:bg-purple-500/10 ${className}`}
        title="Add to playlist"
      >
        <div className="transition-transform duration-300 group-hover:scale-110">
          <List size={20} />
        </div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
          Add to playlist
        </div>
      </button>

      {/* Collections Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#283039] rounded-xl max-w-md w-full max-h-[80vh] overflow-hidden relative">
            <div className="p-6 border-b border-[#3a424d]">
              <button
                onClick={closeModal}
                disabled={!!isAdding}
                className="absolute top-4 right-4 text-[#9cabba] hover:text-white transition-colors disabled:opacity-50"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <List size={20} className="text-white" />
                </div>
                <h2 className="text-white text-xl font-bold">Add to Playlist</h2>
              </div>

              <p className="text-[#9cabba] text-sm">
                Choose a collection to add "{movie.name}" to, or create a new one.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 border-b border-[#3a424d]">
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Collections List */}
            <div className="flex-1 overflow-y-auto max-h-96">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                  <span className="ml-3 text-[#9cabba]">Loading collections...</span>
                </div>
              ) : (
                <>
                  {/* Create New Collection Button */}
                  <button
                    onClick={handleCreateNewCollection}
                    disabled={!!isAdding}
                    className="w-full flex items-center gap-3 p-4 border-b border-[#3a424d] hover:bg-[#1a1f24] transition-colors disabled:opacity-50"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-lg flex items-center justify-center border border-purple-500/30">
                      <Plus className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-white font-medium">Create New Collection</h3>
                      <p className="text-[#9cabba] text-sm">Start a new curated list</p>
                    </div>
                  </button>

                  {/* Existing Collections */}
                  {collections.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-[#9cabba] text-sm">No collections yet. Create your first one!</p>
                    </div>
                  ) : (
                    collections.map((collection) => (
                      <button
                        key={collection.id}
                        onClick={() => handleAddToCollection(collection.id)}
                        disabled={!!isAdding || movieInCollections.has(collection.id)}
                        className={`w-full flex items-center gap-3 p-4 border-b border-[#3a424d] last:border-b-0 transition-colors disabled:opacity-50 ${
                          movieInCollections.has(collection.id) 
                            ? 'bg-yellow-500/10 cursor-not-allowed' 
                            : 'hover:bg-[#1a1f24]'
                        }`}
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-lg flex items-center justify-center">
                          <Film className="w-6 h-6 text-purple-400" />
                        </div>
                        
                        <div className="flex-1 text-left min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-white font-medium line-clamp-1">
                              {collection.title}
                            </h3>
                            {movieInCollections.has(collection.id) && (
                              <span className="text-yellow-400 text-xs bg-yellow-500/20 px-2 py-1 rounded-full flex-shrink-0">
                                Already added
                              </span>
                            )}
                            {collection.is_public ? (
                              <Globe className="w-3 h-3 text-green-400 flex-shrink-0" />
                            ) : (
                              <Lock className="w-3 h-3 text-yellow-400 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-[#9cabba] text-sm line-clamp-1">
                            {movieInCollections.has(collection.id) 
                              ? `"${movie.name}" is already in this collection`
                              : (collection.description || 'No description')
                            }
                          </p>
                          <p className="text-[#9cabba] text-xs mt-1">
                            {collection.movie_count || 0} movies
                          </p>
                        </div>

                        {isAdding === collection.id && (
                          <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                        )}
                      </button>
                    ))
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Collection Modal */}
      <CreateCollectionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCollectionCreated}
      />
    </>
  );
};

export default AddToPlaylistButton;