/*
  # Create Themed Collections System

  1. New Tables
    - `themed_collections`
      - `id` (uuid, primary key)
      - `title` (text, collection name)
      - `description` (text, collection description)
      - `creator_id` (uuid, references auth.users)
      - `creator_name` (text, display name of creator)
      - `is_public` (boolean, whether collection is publicly visible)
      - `cover_image` (text, URL to cover image)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `collection_movies`
      - `id` (uuid, primary key)
      - `collection_id` (uuid, references themed_collections)
      - `movie_name` (text)
      - `movie_genre` (text)
      - `movie_description` (text)
      - `movie_synopsis` (text)
      - `movie_poster` (text, URL to poster)
      - `added_at` (timestamp)
      - `order_index` (integer, for ordering movies in collection)

  2. Security
    - Enable RLS on both tables
    - Users can create, read, update, delete their own collections
    - Users can read public collections from others
    - Users can read movies from public collections
*/

-- Create themed_collections table
CREATE TABLE IF NOT EXISTS themed_collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  creator_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  creator_name text NOT NULL DEFAULT 'Anonymous',
  is_public boolean DEFAULT false,
  cover_image text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create collection_movies table
CREATE TABLE IF NOT EXISTS collection_movies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id uuid REFERENCES themed_collections(id) ON DELETE CASCADE,
  movie_name text NOT NULL,
  movie_genre text NOT NULL,
  movie_description text,
  movie_synopsis text,
  movie_poster text,
  added_at timestamptz DEFAULT now(),
  order_index integer DEFAULT 0
);

-- Enable RLS
ALTER TABLE themed_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_movies ENABLE ROW LEVEL SECURITY;

-- Policies for themed_collections
CREATE POLICY "Users can create their own collections"
  ON themed_collections
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can read their own collections"
  ON themed_collections
  FOR SELECT
  TO authenticated
  USING (auth.uid() = creator_id);

CREATE POLICY "Users can read public collections"
  ON themed_collections
  FOR SELECT
  TO authenticated
  USING (is_public = true);

CREATE POLICY "Users can update their own collections"
  ON themed_collections
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = creator_id);

CREATE POLICY "Users can delete their own collections"
  ON themed_collections
  FOR DELETE
  TO authenticated
  USING (auth.uid() = creator_id);

-- Policies for collection_movies
CREATE POLICY "Users can add movies to their collections"
  ON collection_movies
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM themed_collections 
      WHERE id = collection_id AND creator_id = auth.uid()
    )
  );

CREATE POLICY "Users can read movies from their collections"
  ON collection_movies
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM themed_collections 
      WHERE id = collection_id AND creator_id = auth.uid()
    )
  );

CREATE POLICY "Users can read movies from public collections"
  ON collection_movies
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM themed_collections 
      WHERE id = collection_id AND is_public = true
    )
  );

CREATE POLICY "Users can update movies in their collections"
  ON collection_movies
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM themed_collections 
      WHERE id = collection_id AND creator_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete movies from their collections"
  ON collection_movies
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM themed_collections 
      WHERE id = collection_id AND creator_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_themed_collections_creator_id ON themed_collections(creator_id);
CREATE INDEX IF NOT EXISTS idx_themed_collections_is_public ON themed_collections(is_public);
CREATE INDEX IF NOT EXISTS idx_themed_collections_created_at ON themed_collections(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_collection_movies_collection_id ON collection_movies(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_movies_order_index ON collection_movies(collection_id, order_index);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for themed_collections
CREATE TRIGGER update_themed_collections_updated_at 
    BEFORE UPDATE ON themed_collections 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();