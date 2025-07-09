import React from 'react';
import MovieCategoryCard from './MovieCategoryCard';

interface MovieCategoriesProps {
  onCategorySearch?: (query: string) => void;
}

const MovieCategories: React.FC<MovieCategoriesProps> = ({ onCategorySearch }) => {
  const categories = [
    {
      title: "Action-Packed Thrillers",
      description: "If you're in the mood for adrenaline, check out these high-octane thrillers.",
      imageUrl: "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1"
    },
    {
      title: "Romantic Comedies",
      description: "Need a good laugh and a heartwarming story? These romantic comedies are perfect.",
      imageUrl: "https://images.pexels.com/photos/7991319/pexels-photo-7991319.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1"
    },
    {
      title: "Mind-Bending Sci-Fi",
      description: "Explore the unknown with these thought-provoking science fiction films.",
      imageUrl: "https://images.pexels.com/photos/796206/pexels-photo-796206.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1"
    },
    {
      title: "Classic Dramas",
      description: "Experience powerful storytelling with these timeless dramas.",
      imageUrl: "https://images.pexels.com/photos/7991622/pexels-photo-7991622.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1"
    },
    {
      title: "Horror & Suspense",
      description: "Get your heart racing with these spine-chilling horror films.",
      imageUrl: "https://images.pexels.com/photos/33129/popcorn-movie-party-entertainment.jpg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1"
    },
    {
      title: "Family Adventures",
      description: "Perfect for movie night with the whole family - fun for all ages.",
      imageUrl: "https://images.pexels.com/photos/7991350/pexels-photo-7991350.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1"
    }
  ];

  const handleCategoryClick = (title: string) => {
    if (onCategorySearch) {
      onCategorySearch(title);
    }
  };

  return (
    <div className="grid gap-2 md:gap-4">
      {categories.map((category, index) => (
        <MovieCategoryCard
          key={index}
          title={category.title}
          description={category.description}
          imageUrl={category.imageUrl}
          onCategoryClick={() => handleCategoryClick(category.title)}
        />
      ))}
    </div>
  );
};

export default MovieCategories;