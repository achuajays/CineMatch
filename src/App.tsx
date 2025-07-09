import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ParallaxHero from './components/ParallaxHero';
import ApiKeyModal from './components/ApiKeyModal';
import SearchSection from './components/SearchSection';
import MovieCategories from './components/MovieCategories';
import MovieResults from './components/MovieResults';
import MovieDetailsPage from './components/MovieDetailsPage';
import SavedMoviesPage from './components/SavedMoviesPage';
import ThankYouPage from './components/ThankYouPage';
import WatchedMoviesPage from './components/WatchedMoviesPage';
import SavedMovieDetailsPage from './components/SavedMovieDetailsPage';
import WatchedMovieDetailsPage from './components/WatchedMovieDetailsPage';
import DislikedMoviesPage from './components/DislikedMoviesPage';
import DislikedMovieDetailsPage from './components/DislikedMovieDetailsPage';
import { Movie } from './types/movie';
import RecommendationsPage from './components/RecommendationsPage';
import RecommendedMovieDetailsPage from './components/RecommendedMovieDetailsPage';

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);

  const handleMoviesFound = (foundMovies: Movie[], query: string) => {
    setMovies(foundMovies);
    setSearchQuery(query);
  };

  const handleLoadingChange = (loading: boolean) => {
    setIsLoading(loading);
  };

  const handleSettingsClick = () => {
    setIsApiModalOpen(true);
  };

  const handleApiKeySave = (apiKey: string) => {
    localStorage.setItem('groq_api_key', apiKey);
  };

  const getCurrentApiKey = () => {
    return localStorage.getItem('groq_api_key') || '';
  };

  const handleCategorySearch = async (categoryTitle: string) => {
    setSearchQuery(categoryTitle);
    
    // Check if API key is configured
    const apiKey = localStorage.getItem('groq_api_key');
    if (!apiKey) {
      alert('Please configure your Groq API key in settings first.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { getMovieRecommendations } = await import('./services/groqService');
      const foundMovies = await getMovieRecommendations(categoryTitle);
      
      // Additional client-side filtering as backup
      const { getSavedMovies } = await import('./services/storageService');
      const { getWatchedMovies } = await import('./services/watchedMoviesService');
      const { getDislikedMovies } = await import('./services/dislikedMoviesService');
      const savedMovies = getSavedMovies();
      const watchedMovies = getWatchedMovies();
      const dislikedMovies = getDislikedMovies();
      const existingMovieNames = new Set([
        ...savedMovies.map(m => m.name.toLowerCase()),
        ...watchedMovies.map(m => m.name.toLowerCase()),
        ...dislikedMovies.map(m => m.name.toLowerCase())
      ]);
      
      const filteredMovies = foundMovies.filter(movie => 
        !existingMovieNames.has(movie.name.toLowerCase())
      );
      
      setMovies(filteredMovies);
    } catch (error) {
      console.error('Category search failed:', error);
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeatureSearch = async (searchQuery: string) => {
    // Check if API key is configured
    const apiKey = localStorage.getItem('groq_api_key');
    if (!apiKey) {
      alert('Please configure your Groq API key in settings first.');
      return;
    }
    
    setSearchQuery(searchQuery);
    setIsLoading(true);
    
    try {
      const { getMovieRecommendations } = await import('./services/groqService');
      const foundMovies = await getMovieRecommendations(searchQuery);
      
      // Additional client-side filtering as backup
      const { getSavedMovies } = await import('./services/storageService');
      const { getWatchedMovies } = await import('./services/watchedMoviesService');
      const { getDislikedMovies } = await import('./services/dislikedMoviesService');
      const savedMovies = getSavedMovies();
      const watchedMovies = getWatchedMovies();
      const dislikedMovies = getDislikedMovies();
      const existingMovieNames = new Set([
        ...savedMovies.map(m => m.name.toLowerCase()),
        ...watchedMovies.map(m => m.name.toLowerCase()),
        ...dislikedMovies.map(m => m.name.toLowerCase())
      ]);
      
      const filteredMovies = foundMovies.filter(movie => 
        !existingMovieNames.has(movie.name.toLowerCase())
      );
      
      setMovies(filteredMovies);
    } catch (error) {
      console.error('Feature search failed:', error);
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#111418] text-white overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <Routes>
          <Route path="/" element={
            <>
              <Header onSettingsClick={handleSettingsClick} />
              <ParallaxHero onFeatureClick={handleFeatureSearch} />
              <main className="flex-1 flex justify-center">
                <div className="w-full max-w-6xl mx-auto px-4 md:px-8 lg:px-12">
                  <div className="flex flex-col max-w-4xl mx-auto">
                    <SearchSection 
                      onMoviesFound={handleMoviesFound}
                      onLoadingChange={handleLoadingChange}
                      searchQuery={searchQuery}
                      onSearchQueryChange={setSearchQuery}
                    />
                    
                    <MovieResults 
                      movies={movies}
                      isLoading={isLoading}
                      searchQuery={searchQuery}
                    />
                    
                    {!searchQuery && !isLoading && (
                      <MovieCategories onCategorySearch={handleCategorySearch} />
                    )}
                  </div>
                </div>
              </main>
            </>
          } />
          <Route path="/movie/:movieId" element={<MovieDetailsPage movies={movies} />} />
          <Route path="/saved" element={<SavedMoviesPage />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
          <Route path="/watched" element={<WatchedMoviesPage />} />
          <Route path="/saved-movie/:movieId" element={<SavedMovieDetailsPage />} />
          <Route path="/watched-movie/:movieId" element={<WatchedMovieDetailsPage />} />
          <Route path="/disliked" element={<DislikedMoviesPage />} />
          <Route path="/disliked-movie/:movieId" element={<DislikedMovieDetailsPage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route path="/movie-recommendation/:movieTitle" element={<RecommendedMovieDetailsPage />} />
        </Routes>
        
        <ApiKeyModal
          isOpen={isApiModalOpen}
          onClose={() => setIsApiModalOpen(false)}
          onSave={handleApiKeySave}
          currentApiKey={getCurrentApiKey()}
        />
      </div>
    </div>
  );
}

export default App;