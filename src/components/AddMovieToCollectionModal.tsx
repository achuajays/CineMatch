import React, { useState } from 'react';
import { X, Film, Search, AlertCircle } from 'lucide-react';
import { addMovieToCollection, CollectionMovie } from '../services/themedCollectionsService';
import { Movie } from '../types/movie';

// OMDB API response interface
interface OMDBMovie {
  title: string;
  year: string;
  imdbRating: string;
  genre: string;
  actors: string;
  plot: string;
  poster: string;
}

// Function to search movies using OMDB API
const searchMoviesOMDB = async (query: string): Promise<Movie[]> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/omdb/movie`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: query
      })
    });

    // Handle 404 as "no movies found" rather than an error
    if (response.status === 404) {
      return []; // Return empty array for no movies found
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: OMDBMovie = await response.json();
    
    // Convert OMDB response to Movie format
    const movie: Movie = {
      name: data.title,
      genre: data.genre.split(',')[0].trim(), // Take first genre
      smallDescription: `${data.year} • IMDb ${data.imdbRating}`,
      bigDescription: data.plot,
      synopsis: `${data.plot} Starring: ${data.actors}`
    };

    return [movie]; // Return as array since we get one movie
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

interface AddMovieToCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  collectionId: string;
  onSuccess: (movie: CollectionMovie) => void;
}

const AddMovieToCollectionModal: React.FC<AddMovieToCollectionModalProps> = ({ 
  isOpen, 
  onClose, 
  collectionId, 
  onSuccess 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setError('');

    try {
      const movies = await searchMoviesOMDB(searchQuery);
      setSearchResults(movies);
    } catch (error) {
      console.error('Error searching movies:', error);
      setError('Failed to search movies. Please check the movie title and try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddMovie = async (movie: Movie) => {
    setIsAdding(true);
    setError('');

    try {
      const success = await addMovieToCollection({
        collection_id: collectionId,
        movie: movie
      });

      if (success) {
        // Create a mock CollectionMovie object for the callback
        const newCollectionMovie: CollectionMovie = {
          id: `temp-${Date.now()}`, // Temporary ID
          collection_id: collectionId,
          movie_name: movie.name,
          movie_genre: movie.genre,
          movie_description: movie.smallDescription,
          movie_synopsis: movie.synopsis,
          movie_poster: '',
          added_at: new Date().toISOString(),
          order_index: 0
        };
        
        onSuccess(newCollectionMovie);
      } else {
        setError('Failed to add movie to collection.');
      }
    } catch (error) {
      console.error('Error adding movie:', error);
      setError('An error occurred while adding the movie.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleClose = () => {
    if (!isAdding) {
      setSearchQuery('');
      setSearchResults([]);
      setError('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#283039] rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden relative">
        <div className="p-6 border-b border-[#3a424d]">
          <button
            onClick={handleClose}
            disabled={isAdding}
            className="absolute top-4 right-4 text-[#9cabba] hover:text-white transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-600 rounded-lg">
              <Film size={20} className="text-white" />
            </div>
            <h2 className="text-white text-xl font-bold">Add Movie to Collection</h2>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9cabba]" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for movies to add..."
                className="w-full bg-[#1a1f24] text-white rounded-lg pl-10 pr-4 py-3 border border-[#3a424d] focus:border-purple-500 focus:outline-none transition-colors"
                disabled={isSearching || isAdding}
              />
            </div>
            <button
              type="submit"
              disabled={isSearching || isAdding || !searchQuery.trim()}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 font-medium"
            >
              {isSearching ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Searching...
                </>
              ) : (
                'Search'
              )}
            </button>
          </form>
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

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto max-h-96">
          {searchResults.length === 0 && !isSearching && searchQuery && (
            <div className="text-center py-8">
              <p className="text-[#9cabba]">No movies found. Try a different search term.</p>
            </div>
          )}

          {searchResults.length === 0 && !searchQuery && (
            <div className="text-center py-8">
              <p className="text-[#9cabba]">Search for movies to add to your collection.</p>
            </div>
          )}

          {searchResults.map((movie, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 border-b border-[#3a424d] last:border-b-0 hover:bg-[#1a1f24] transition-colors"
            >
              <div className="w-16 h-24 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Film className="w-6 h-6 text-purple-400" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-white text-base font-bold mb-1 line-clamp-1">
                  {movie.name}
                </h3>
                <p className="text-purple-400 text-sm mb-2">{movie.genre}</p>
                <p className="text-[#9cabba] text-sm line-clamp-2 mb-3">
                  {movie.smallDescription}
                </p>
                
                <button
                  onClick={() => handleAddMovie(movie)}
                  disabled={isAdding}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 text-sm font-medium"
                >
                  {isAdding ? 'Adding...' : 'Add to Collection'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddMovieToCollectionModal;