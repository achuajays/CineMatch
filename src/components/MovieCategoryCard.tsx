import React from 'react';

interface MovieCategoryCardProps {
  title: string;
  description: string;
  imageUrl: string;
  onCategoryClick?: () => void;
}

const MovieCategoryCard: React.FC<MovieCategoryCardProps> = ({
  title,
  description,
  imageUrl,
  onCategoryClick
}) => {
  return (
    <div className="p-4">
      <div 
        className="flex items-stretch justify-between gap-4 rounded-xl p-4 hover:bg-[#1a1f24] transition-colors cursor-pointer group"
        onClick={onCategoryClick}
      >
        <div className="flex flex-col gap-2 flex-[2_2_0px]">
          <h3 className="text-white text-base md:text-lg font-bold leading-tight group-hover:text-blue-400 transition-colors">
            {title}
          </h3>
          <p className="text-[#9cabba] text-sm md:text-base font-normal leading-normal">
            {description}
          </p>
        </div>
        <div
          className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl flex-1 min-w-[120px] md:min-w-[160px] group-hover:scale-105 transition-transform"
          style={{ backgroundImage: `url("${imageUrl}")` }}
        />
      </div>
    </div>
  );
};

export default MovieCategoryCard;