import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Plus, Users, Lock, Globe, Calendar, Film, Trash2, Edit3 } from 'lucide-react';
import { 
  getUserCollections, 
  getPublicCollections, 
  ThemedCollection,
  deleteThemedCollection 
} from '../services/themedCollectionsService';
import { getMovieImage } from '../services/imageService';
import CreateCollectionModal from './CreateCollectionModal';
import EditCollectionModal from './EditCollectionModal';

const ThemedCollectionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'my' | 'public'>('my');
  const [searchQuery, setSearchQuery] = useState('');
  const [myCollections, setMyCollections] = useState<ThemedCollection[]>([]);
  const [publicCollections, setPublicCollections] = useState<ThemedCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<ThemedCollection | null>(null);
  const [collectionCovers, setCollectionCovers] = useState<Record<string, string>>({});

  useEffect(() => {
    loadCollections();
  }, []);

  useEffect(() => {
    if (activeTab === 'public') {
      searchPublicCollections();
    }
  }, [searchQuery, activeTab]);

  // Load collection cover images
  useEffect(() => {
    const loadCollectionCovers = async () => {
      const allCollections = [...myCollections, ...publicCollections];
      const coverPromises = allCollections.map(async (collection) => {
        if (collection.cover_image) {
          return { id: collection.id, url: collection.cover_image };
        } else if (collection.movie_count && collection.movie_count > 0) {
          try {
            // Get the first movie from this collection to use as cover
            const { getCollectionMovies } = await import('../services/themedCollectionsService');
            const movies = await getCollectionMovies(collection.id);
            if (movies.length > 0) {
              const imageUrl = await getMovieImage(movies[0].movie_name);
              return { id: collection.id, url: imageUrl };
            }
          } catch (error) {
            console.error('Error loading movie image for collection cover:', error);
          }
        }
        return { id: collection.id, url: '' };
      });

      const results = await Promise.allSettled(coverPromises);
      const coverMap: Record<string, string> = {};
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value.url) {
          coverMap[result.value.id] = result.value.url;
        }
      });

      setCollectionCovers(coverMap);
    };

    if (myCollections.length > 0 || publicCollections.length > 0) {
      loadCollectionCovers();
    }
  }, [myCollections, publicCollections]);
  const loadCollections = async () => {
    setIsLoading(true);
    try {
      const [userCollections, publicCollections] = await Promise.all([
        getUserCollections(),
        getPublicCollections()
      ]);
      setMyCollections(userCollections);
      setPublicCollections(publicCollections);
    } catch (error) {
      console.error('Error loading collections:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const searchPublicCollections = async () => {
    try {
      const collections = await getPublicCollections(searchQuery);
      setPublicCollections(collections);
    } catch (error) {
      console.error('Error searching collections:', error);
    }
  };

  const handleDeleteCollection = async (collectionId: string) => {
    if (window.confirm('Are you sure you want to delete this collection? This action cannot be undone.')) {
      const success = await deleteThemedCollection(collectionId);
      if (success) {
        setMyCollections(prev => prev.filter(c => c.id !== collectionId));
      }
    }
  };

  const handleEditCollection = (collection: ThemedCollection) => {
    setEditingCollection(collection);
    setIsEditModalOpen(true);
  };

  const handleCollectionUpdated = (updatedCollection: ThemedCollection) => {
    setMyCollections(prev => 
      prev.map(c => c.id === updatedCollection.id ? updatedCollection : c)
    );
    setIsEditModalOpen(false);
    setEditingCollection(null);
  };

  const handleCollectionClick = (collection: ThemedCollection) => {
    navigate(`/themed-collection/${collection.id}`, { state: { collection } });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredMyCollections = myCollections.filter(collection =>
    collection.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collection.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const collectionsToShow = activeTab === 'my' ? filteredMyCollections : publicCollections;

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#111518] text-white overflow-x-hidden" style={{ fontFamily: '"Space Grotesk", "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#283039] px-4 md:px-10 py-3">
          <div className="flex items-center gap-4 text-white">
            <div 
              className="size-8 md:size-10 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate('/')}
            >
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
            <h1 
              className="text-white text-xl md:text-2xl font-bold leading-tight tracking-[-0.015em] bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate('/')}
            >
              Themed Collections
            </h1>
          </div>
          
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 bg-[#283039] hover:bg-[#3a424d] text-white px-4 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="hidden md:inline">Back to Home</span>
          </button>
        </header>

        {/* Main Content */}
        <div className="px-4 md:px-10 lg:px-20 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-full max-w-7xl">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h2 className="text-white text-2xl md:text-3xl font-bold mb-2">
                  Movie Collections
                </h2>
                <p className="text-[#9cabba] text-base">
                  Create and discover curated movie collections
                </p>
              </div>
              
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 font-medium"
              >
                <Plus size={20} />
                New Collection
              </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 mb-6 bg-[#283039] rounded-lg p-1">
              <button
                onClick={() => setActiveTab('my')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                  activeTab === 'my'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-[#9cabba] hover:text-white hover:bg-[#3a424d]'
                }`}
              >
                <Lock size={16} />
                My Collections ({myCollections.length})
              </button>
              <button
                onClick={() => setActiveTab('public')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                  activeTab === 'public'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-[#9cabba] hover:text-white hover:bg-[#3a424d]'
                }`}
              >
                <Globe size={16} />
                Public Collections ({publicCollections.length})
              </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9cabba]" size={20} />
                <input
                  type="text"
                  placeholder={`Search ${activeTab === 'my' ? 'your' : 'public'} collections...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#283039] text-white rounded-lg pl-10 pr-4 py-3 border border-[#3a424d] focus:border-purple-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
              </div>
            )}

            {/* Collections Grid */}
            {!isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collectionsToShow.map((collection) => (
                  <div
                    key={collection.id}
                    className="group bg-gradient-to-br from-[#283039] to-[#1e252b] rounded-xl overflow-hidden hover:from-[#3a424d] hover:to-[#2a3138] transition-all duration-300 cursor-pointer transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10"
                    onClick={() => handleCollectionClick(collection)}
                  >
                    {/* Cover Image */}
                    <div className="relative aspect-video overflow-hidden">
                      {collection.cover_image || collectionCovers[collection.id] ? (
                        <img
                          src={collection.cover_image || collectionCovers[collection.id]}
                          alt={collection.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center ${collection.cover_image || collectionCovers[collection.id] ? 'hidden' : ''}`}>
                          <Film className="w-12 h-12 text-purple-400" />
                        </div>
                      )}
                      
                      {/* Privacy Badge */}
                      <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1">
                        {collection.is_public ? (
                          <Globe className="w-3 h-3 text-green-400" />
                        ) : (
                          <Lock className="w-3 h-3 text-yellow-400" />
                        )}
                        <span className="text-xs text-white">
                          {collection.is_public ? 'Public' : 'Private'}
                        </span>
                      </div>

                      {/* Action Buttons (only for user's collections) */}
                      {activeTab === 'my' && (
                        <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditCollection(collection);
                            }}
                            className="p-2 bg-black/60 backdrop-blur-sm rounded-full hover:bg-black/80 transition-colors"
                          >
                            <Edit3 className="w-3 h-3 text-white" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCollection(collection.id);
                            }}
                            className="p-2 bg-black/60 backdrop-blur-sm rounded-full hover:bg-red-600/80 transition-colors"
                          >
                            <Trash2 className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Collection Info */}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-white text-lg font-bold leading-tight line-clamp-2 group-hover:text-purple-400 transition-colors">
                          {collection.title}
                        </h3>
                        <div className="flex items-center gap-1 text-[#9cabba] text-sm flex-shrink-0">
                          <Film className="w-4 h-4" />
                          <span>{collection.movie_count || 0}</span>
                        </div>
                      </div>
                      
                      {collection.description && (
                        <p className="text-[#9cabba] text-sm leading-relaxed line-clamp-2 mb-3">
                          {collection.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between text-[#9cabba] text-xs">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{collection.creator_name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(collection.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && collectionsToShow.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-[#283039] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Film className="w-8 h-8 text-[#9cabba]" />
                </div>
                <h3 className="text-white text-xl font-bold mb-2">
                  {searchQuery 
                    ? 'No collections found' 
                    : activeTab === 'my' 
                      ? 'No collections yet' 
                      : 'No public collections available'
                  }
                </h3>
                <p className="text-[#9cabba] text-base mb-6">
                  {searchQuery 
                    ? 'Try adjusting your search terms' 
                    : activeTab === 'my'
                      ? 'Create your first themed movie collection'
                      : 'Be the first to create a public collection'
                  }
                </p>
                {!searchQuery && activeTab === 'my' && (
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                  >
                    Create Collection
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Collection Modal */}
      <CreateCollectionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={(newCollection) => {
          setMyCollections(prev => [newCollection, ...prev]);
          setIsCreateModalOpen(false);
        }}
      />

      {/* Edit Collection Modal */}
      <EditCollectionModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingCollection(null);
        }}
        collection={editingCollection}
        onSuccess={handleCollectionUpdated}
      />
    </div>
  );
};

export default ThemedCollectionsPage;