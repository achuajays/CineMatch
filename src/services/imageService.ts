const API_URL = import.meta.env.VITE_API_URL;
const IMAGE_API_URL = `${API_URL}/image-search/search`;
// Local storage keys for image caching
const IMAGE_CACHE_KEY = 'cinematch_image_cache';
const CACHE_EXPIRY_KEY = 'cinematch_image_cache_expiry';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
interface ImageApiResponse {
  data: {
    image_url: string;
  };
}

// Cache for storing fetched image URLs in memory (for current session)
const memoryCache = new Map<string, string>();

// Load cache from localStorage
const loadCacheFromStorage = (): Map<string, string> => {
  try {
    const cacheData = localStorage.getItem(IMAGE_CACHE_KEY);
    const cacheExpiry = localStorage.getItem(CACHE_EXPIRY_KEY);
    
    if (!cacheData || !cacheExpiry) {
      return new Map();
    }
    
    // Check if cache has expired
    const expiryTime = parseInt(cacheExpiry);
    if (Date.now() > expiryTime) {
      // Cache expired, clear it
      localStorage.removeItem(IMAGE_CACHE_KEY);
      localStorage.removeItem(CACHE_EXPIRY_KEY);
      return new Map();
    }
    
    const parsedCache = JSON.parse(cacheData);
    return new Map(Object.entries(parsedCache));
  } catch (error) {
    console.error('Error loading image cache from storage:', error);
    return new Map();
  }
};

// Save cache to localStorage
const saveCacheToStorage = (cache: Map<string, string>): void => {
  try {
    const cacheObject = Object.fromEntries(cache);
    const expiryTime = Date.now() + CACHE_DURATION;
    
    localStorage.setItem(IMAGE_CACHE_KEY, JSON.stringify(cacheObject));
    localStorage.setItem(CACHE_EXPIRY_KEY, expiryTime.toString());
  } catch (error) {
    console.error('Error saving image cache to storage:', error);
  }
};

// Initialize cache from localStorage
const persistentCache = loadCacheFromStorage();

export const getMovieImage = async (movieName: string): Promise<string> => {
  // Check memory cache first
  const cacheKey = movieName.toLowerCase().trim();
  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey)!;
  }
  
  // Check persistent cache
  if (persistentCache.has(cacheKey)) {
    const cachedUrl = persistentCache.get(cacheKey)!;
    // Also store in memory cache for faster access
    memoryCache.set(cacheKey, cachedUrl);
    return cachedUrl;
  }

  try {
    const response = await fetch(IMAGE_API_URL, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `${movieName}`
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ImageApiResponse = await response.json();
    
    if (data.data && data.data.image_url) {
      // Cache the result in both memory and persistent storage
      memoryCache.set(cacheKey, data.data.image_url);
      persistentCache.set(cacheKey, data.data.image_url);
      saveCacheToStorage(persistentCache);
      return data.data.image_url;
    } else {
      throw new Error('No image URL in response');
    }
  } catch (error) {
    console.error('Error fetching movie image:', error);
    
    // Return fallback image based on movie name hash
    const fallbackImages = [
      "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=1",
      "https://images.pexels.com/photos/7991319/pexels-photo-7991319.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=1",
      "https://images.pexels.com/photos/796206/pexels-photo-796206.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=1",
      "https://images.pexels.com/photos/7991622/pexels-photo-7991622.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=1",
      "https://images.pexels.com/photos/33129/popcorn-movie-party-entertainment.jpg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=1"
    ];
    
    const hash = movieName.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const fallbackUrl = fallbackImages[Math.abs(hash) % fallbackImages.length];
    
    // Cache fallback URL as well
    memoryCache.set(cacheKey, fallbackUrl);
    persistentCache.set(cacheKey, fallbackUrl);
    saveCacheToStorage(persistentCache);
    
    return fallbackUrl;
  }
};

// Preload images for better performance
export const preloadMovieImages = async (movieNames: string[]): Promise<void> => {
  const promises = movieNames.map(name => getMovieImage(name));
  await Promise.allSettled(promises);
};

// Clear cache if needed
export const clearImageCache = (): void => {
  memoryCache.clear();
  persistentCache.clear();
  localStorage.removeItem(IMAGE_CACHE_KEY);
  localStorage.removeItem(CACHE_EXPIRY_KEY);
};

// Get cache statistics
export const getCacheStats = (): { memorySize: number; persistentSize: number; expiryDate: Date | null } => {
  const expiryTime = localStorage.getItem(CACHE_EXPIRY_KEY);
  return {
    memorySize: memoryCache.size,
    persistentSize: persistentCache.size,
    expiryDate: expiryTime ? new Date(parseInt(expiryTime)) : null
  };
};