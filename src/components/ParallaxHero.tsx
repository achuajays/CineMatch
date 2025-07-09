import React, { useEffect, useState } from 'react';
import { Play, Star, Calendar } from 'lucide-react';
import { getSavedMovies } from '../services/storageService';
import { getWatchedMovies } from '../services/watchedMoviesService';

interface ParallaxHeroProps {
  onFeatureClick?: (searchQuery: string) => void;
}

const ParallaxHero: React.FC<ParallaxHeroProps> = ({ onFeatureClick }) => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e: MouseEvent) => {
      // Only apply mouse parallax on desktop
      if (!isMobile) {
        setMousePosition({
          x: (e.clientX / window.innerWidth) * 2 - 1,
          y: (e.clientY / window.innerHeight) * 2 - 1,
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', checkMobile);
    };
  }, [isMobile]);

  // Reduce parallax intensity on mobile
  const parallaxOffset = isMobile ? scrollY * 0.2 : scrollY * 0.5;
  const mouseParallaxX = isMobile ? 0 : mousePosition.x * 20;
  const mouseParallaxY = isMobile ? 0 : mousePosition.y * 20;

  const handleFeatureClick = (featureType: string) => {
    if (!onFeatureClick) return;
    
    // Get movies to avoid
    const savedMovies = getSavedMovies();
    const watchedMovies = getWatchedMovies();
    const totalMoviesCount = savedMovies.length + watchedMovies.length;
    
    let searchQuery = '';
    switch (featureType) {
      case 'smart':
        // Random movie discovery
        const randomQueries = [
          `surprise me with something good${totalMoviesCount > 0 ? ' that I haven\'t watched or saved yet' : ''}`,
          `hidden gems and underrated movies${totalMoviesCount > 0 ? ' that are new to me' : ''}`,
          `movies I probably haven\'t seen${totalMoviesCount > 0 ? ' and aren\'t in my collection' : ''}`,
          `random excellent films${totalMoviesCount > 0 ? ' I haven\'t discovered yet' : ''}`,
          `unexpected movie recommendations${totalMoviesCount > 0 ? ' for fresh discoveries' : ''}`
        ];
        searchQuery = randomQueries[Math.floor(Math.random() * randomQueries.length)];
        break;
      case 'curated':
        searchQuery = `most popular and highly rated movies of all time${totalMoviesCount > 0 ? ' that I haven\'t seen yet' : ''}`;
        break;
      case 'latest':
        searchQuery = `best new movie releases 2024 2023${totalMoviesCount > 0 ? ' that I haven\'t watched' : ''}`;
        break;
    }
    
    onFeatureClick(searchQuery);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background layers with parallax */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform"
        style={{
          backgroundImage: 'url("https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1")',
          transform: `translateY(${parallaxOffset}px) scale(${isMobile ? 1.05 : 1.1})`,
        }}
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#111418]" />
      
      {/* Floating 3D elements - Only on desktop */}
      {!isMobile && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Film strip elements */}
          <div 
            className="absolute top-10 md:top-20 left-4 md:left-10 w-12 h-24 md:w-16 md:h-32 bg-gradient-to-b from-yellow-400/20 to-yellow-600/20 rounded-lg transform rotate-12 will-change-transform"
            style={{
              transform: `translateX(${mouseParallaxX * 0.5}px) translateY(${mouseParallaxY * 0.3}px) rotate(12deg) perspective(1000px) rotateY(${mousePosition.x * 10}deg)`,
            }}
          >
            <div className="w-full h-full border-2 border-yellow-400/30 rounded-lg">
              <div className="flex flex-col justify-between h-full p-1">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-full h-2 md:h-3 bg-yellow-400/20 rounded-sm" />
                ))}
              </div>
            </div>
          </div>

          {/* Floating movie reels */}
          <div 
            className="absolute top-20 md:top-32 right-10 md:right-20 w-16 h-16 md:w-20 md:h-20 border-4 border-blue-400/30 rounded-full will-change-transform"
            style={{
              transform: `translateX(${-mouseParallaxX * 0.7}px) translateY(${mouseParallaxY * 0.5}px) perspective(1000px) rotateX(${mousePosition.y * 15}deg) rotateY(${mousePosition.x * 15}deg)`,
            }}
          >
            <div className="w-full h-full bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 md:w-8 md:h-8 border-2 border-blue-400/40 rounded-full" />
            </div>
          </div>

          {/* Popcorn container */}
          <div 
            className="absolute bottom-20 md:bottom-32 left-10 md:left-20 w-10 h-12 md:w-12 md:h-16 bg-gradient-to-t from-red-500/20 to-red-300/20 rounded-b-lg will-change-transform"
            style={{
              transform: `translateX(${mouseParallaxX * 0.3}px) translateY(${-mouseParallaxY * 0.4}px) perspective(1000px) rotateZ(${mousePosition.x * 5}deg)`,
            }}
          >
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              {[...Array(3)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute w-1.5 h-1.5 md:w-2 md:h-2 bg-yellow-200/40 rounded-full"
                  style={{
                    left: `${i * 3 - 3}px`,
                    top: `${i * -1.5}px`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Ticket stub */}
          <div 
            className="absolute bottom-10 md:bottom-20 right-16 md:right-32 w-20 h-10 md:w-24 md:h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-400/30 will-change-transform"
            style={{
              transform: `translateX(${-mouseParallaxX * 0.6}px) translateY(${-mouseParallaxY * 0.2}px) perspective(1000px) rotateY(${-mousePosition.x * 12}deg)`,
            }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-0.5 h-6 md:h-8 border-l-2 border-dashed border-purple-400/40" />
            </div>
          </div>

          {/* Floating stars */}
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute will-change-transform"
              style={{
                left: `${20 + i * 15}%`,
                top: `${10 + i * 8}%`,
                transform: `translateX(${mouseParallaxX * (0.2 + i * 0.1)}px) translateY(${mouseParallaxY * (0.1 + i * 0.05)}px) perspective(1000px) rotateZ(${mousePosition.x * (5 + i * 2)}deg)`,
              }}
            >
              <Star 
                size={10 + i * 2} 
                className="text-yellow-400/40 fill-current animate-pulse"
                style={{ animationDelay: `${i * 0.5}s` }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
        <div className="text-center max-w-4xl w-full">
          {/* 3D Title */}
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-4 md:mb-6 leading-tight will-change-transform"
            style={{
              textShadow: '0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(59, 130, 246, 0.3)',
              transform: isMobile ? 'none' : `perspective(1000px) rotateX(${mousePosition.y * 5}deg) rotateY(${mousePosition.x * 5}deg)`,
            }}
          >
            Cine<span className="text-blue-400">Match</span>
          </h1>
          
          {/* Subtitle with 3D effect */}
          <p 
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-6 md:mb-8 leading-relaxed px-4 will-change-transform"
            style={{
              transform: isMobile ? 'none' : `perspective(1000px) rotateX(${mousePosition.y * 3}deg) rotateY(${mousePosition.x * 3}deg)`,
            }}
          >
            Discover your next favorite movie with AI-powered recommendations
          </p>

          {/* Feature cards with 3D hover */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-8 md:mt-12 px-4">
            {[
              { icon: Play, title: "Smart Discovery", desc: "AI finds your perfect match", type: "smart" },
              { icon: Star, title: "Curated Lists", desc: "Handpicked collections", type: "curated" },
              { icon: Calendar, title: "Latest Releases", desc: "Stay up to date", type: "latest" }
            ].map((feature, index) => (
              <div
                key={index}
                className="group bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 will-change-transform"
                style={{
                  transform: isMobile ? 'none' : `perspective(1000px) rotateX(${mousePosition.y * 2}deg) rotateY(${mousePosition.x * 2}deg)`,
                  transformStyle: 'preserve-3d',
                }}
                onClick={() => handleFeatureClick(feature.type)}
              >
                <div className="transform group-hover:scale-110 transition-transform duration-300 pointer-events-none">
                  <feature.icon className="w-6 h-6 md:w-8 md:h-8 text-blue-400 mx-auto mb-3 md:mb-4" />
                  <h3 className="text-white font-bold text-base md:text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-300 text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Scroll indicator - Only on desktop */}
          {!isMobile && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
              <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Animated background particles - Reduced on mobile */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(isMobile ? 10 : 20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse will-change-transform"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ParallaxHero;