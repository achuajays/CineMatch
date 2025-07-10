import { supabase } from './supabaseClient';
import { Movie } from '../types/movie';

export interface ThemedCollection {
  id: string;
  title: string;
  description?: string;
  creator_id: string;
  creator_name: string;
  is_public: boolean;
  cover_image?: string;
  created_at: string;
  updated_at: string;
  movie_count?: number;
}

export interface CollectionMovie {
  id: string;
  collection_id: string;
  movie_name: string;
  movie_genre: string;
  movie_description?: string;
  movie_synopsis?: string;
  movie_poster?: string;
  added_at: string;
  order_index: number;
}

export interface CreateCollectionData {
  title: string;
  description?: string;
  is_public: boolean;
  cover_image?: string;
}

export interface AddMovieToCollectionData {
  collection_id: string;
  movie: Movie;
  order_index?: number;
}

// Get current user
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Create a new themed collection
export const createThemedCollection = async (data: CreateCollectionData): Promise<ThemedCollection | null> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data: collection, error } = await supabase
      .from('themed_collections')
      .insert({
        title: data.title,
        description: data.description,
        creator_id: user.id,
        creator_name: user.user_metadata?.full_name || user.email || 'Anonymous',
        is_public: data.is_public,
        cover_image: data.cover_image,
      })
      .select()
      .single();

    if (error) throw error;
    return collection;
  } catch (error) {
    console.error('Error creating themed collection:', error);
    return null;
  }
};

// Get user's collections
export const getUserCollections = async (): Promise<ThemedCollection[]> => {
  try {
    const user = await getCurrentUser();
    if (!user) return [];

    const { data: collections, error } = await supabase
      .from('themed_collections')
      .select(`
        *,
        collection_movies(count)
      `)
      .eq('creator_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return collections.map(collection => ({
      ...collection,
      movie_count: collection.collection_movies?.[0]?.count || 0
    }));
  } catch (error) {
    console.error('Error fetching user collections:', error);
    return [];
  }
};

// Get public collections
export const getPublicCollections = async (searchQuery?: string): Promise<ThemedCollection[]> => {
  try {
    let query = supabase
      .from('themed_collections')
      .select(`
        *,
        collection_movies(count)
      `)
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,creator_name.ilike.%${searchQuery}%`);
    }

    const { data: collections, error } = await query;

    if (error) throw error;

    return collections.map(collection => ({
      ...collection,
      movie_count: collection.collection_movies?.[0]?.count || 0
    }));
  } catch (error) {
    console.error('Error fetching public collections:', error);
    return [];
  }
};

// Get collection by ID
export const getCollectionById = async (id: string): Promise<ThemedCollection | null> => {
  try {
    const { data: collection, error } = await supabase
      .from('themed_collections')
      .select(`
        *,
        collection_movies(count)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    return {
      ...collection,
      movie_count: collection.collection_movies?.[0]?.count || 0
    };
  } catch (error) {
    console.error('Error fetching collection:', error);
    return null;
  }
};

// Get movies in a collection
export const getCollectionMovies = async (collectionId: string): Promise<CollectionMovie[]> => {
  try {
    const { data: movies, error } = await supabase
      .from('collection_movies')
      .select('*')
      .eq('collection_id', collectionId)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return movies || [];
  } catch (error) {
    console.error('Error fetching collection movies:', error);
    return [];
  }
};

// Add movie to collection
export const addMovieToCollection = async (data: AddMovieToCollectionData): Promise<boolean> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    // Get the next order index
    const { data: lastMovie } = await supabase
      .from('collection_movies')
      .select('order_index')
      .eq('collection_id', data.collection_id)
      .order('order_index', { ascending: false })
      .limit(1)
      .single();

    const nextOrderIndex = data.order_index ?? ((lastMovie?.order_index || 0) + 1);

    const { error } = await supabase
      .from('collection_movies')
      .insert({
        collection_id: data.collection_id,
        movie_name: data.movie.name,
        movie_genre: data.movie.genre,
        movie_description: data.movie.smallDescription,
        movie_synopsis: data.movie.synopsis,
        movie_poster: '', // Will be populated by image service
        order_index: nextOrderIndex,
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error adding movie to collection:', error);
    return false;
  }
};

// Remove movie from collection
export const removeMovieFromCollection = async (movieId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('collection_movies')
      .delete()
      .eq('id', movieId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error removing movie from collection:', error);
    return false;
  }
};

// Update collection
export const updateThemedCollection = async (id: string, updates: Partial<CreateCollectionData>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('themed_collections')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating collection:', error);
    return false;
  }
};

// Delete collection
export const deleteThemedCollection = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('themed_collections')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting collection:', error);
    return false;
  }
};

// Check if user can edit collection
export const canEditCollection = async (collectionId: string): Promise<boolean> => {
  try {
    const user = await getCurrentUser();
    if (!user) return false;

    const { data: collection } = await supabase
      .from('themed_collections')
      .select('creator_id')
      .eq('id', collectionId)
      .single();

    return collection?.creator_id === user.id;
  } catch (error) {
    console.error('Error checking edit permissions:', error);
    return false;
  }
};