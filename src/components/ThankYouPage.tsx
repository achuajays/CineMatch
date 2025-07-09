import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Star, Sparkles, Film, Award, Users } from 'lucide-react';

const ThankYouPage: React.FC = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const mouseParallaxX = mousePosition.x * 15;
  const mouseParallaxY = mousePosition.y * 15;

  const stats = [
    { icon: Film, label: "Movies Discovered", value: "1000+" },
    { icon: Users, label: "Happy Users", value: "50K+" },
    { icon: Award, label: "Recommendations", value: "99.9%" },
  ];

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#111418] text-white overflow-x-hidden" style={{ fontFamily: '"Space Grotesk", "Noto Sans", sans-serif' }}>
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating particles */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}

        {/* Floating 3D elements */}
        <div 
          className="absolute top-20 left-10 w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full border border-blue-400/30"
          style={{
            transform: `translateX(${mouseParallaxX * 0.3}px) translateY(${mouseParallaxY * 0.2}px) perspective(1000px) rotateY(${mousePosition.x * 10}deg)`,
          }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <Heart className="w-6 h-6 text-pink-400 fill-current animate-pulse" />
          </div>
        </div>

        <div 
          className="absolute top-32 right-20 w-12 h-12 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-lg"
          style={{
            transform: `translateX(${-mouseParallaxX * 0.4}px) translateY(${mouseParallaxY * 0.3}px) perspective(1000px) rotateX(${mousePosition.y * 15}deg)`,
          }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <Star className="w-6 h-6 text-yellow-400 fill-current" />
          </div>
        </div>

        <div 
          className="absolute bottom-32 left-20 w-14 h-14 bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-xl"
          style={{
            transform: `translateX(${mouseParallaxX * 0.5}px) translateY(${-mouseParallaxY * 0.4}px) perspective(1000px) rotateZ(${mousePosition.x * 8}deg)`,
          }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-green-400" />
          </div>
        </div>
      </div>

      <div className="layout-container flex h-full grow flex-col relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#283039] px-4 md:px-10 py-3">
          <div className="flex items-center gap-4 text-white">
            <div className="size-8 md:size-10">
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
            <h2 className="text-white text-lg md:text-xl font-bold leading-tight tracking-[-0.015em]">CineMatch</h2>
          </div>
          <div className="flex flex-1 justify-end gap-4 md:gap-8">
            <div className="hidden md:flex items-center gap-9">
              <button 
                onClick={() => navigate('/')}
                className="text-white text-sm font-medium leading-normal hover:text-blue-400 transition-colors flex items-center gap-2"
              >
                Home
              </button>
              <a className="text-white text-sm font-medium leading-normal hover:text-blue-400 transition-colors" href="#">Explore</a>
              <a className="text-white text-sm font-medium leading-normal hover:text-blue-400 transition-colors" href="#">My List</a>
            </div>
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 hover:ring-2 hover:ring-white/20 transition-all cursor-pointer"
              style={{
                backgroundImage: 'url("https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1")'
              }}
            />
          </div>
        </header>

        {/* Main Content */}
        <div className="px-4 md:px-40 flex flex-1 justify-center py-5">
          <div className={`layout-content-container flex flex-col w-full max-w-[600px] py-5 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            
            {/* Back Button for Mobile */}
            <button 
              onClick={() => navigate('/')}
              className="md:hidden flex items-center gap-2 text-white mb-6 hover:text-blue-400 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Home
            </button>

            {/* Main Thank You Section */}
            <div className="text-center mb-12">
              {/* Animated Heart Icon */}
              <div 
                className="mx-auto mb-8 w-24 h-24 bg-gradient-to-br from-pink-500/20 to-red-600/20 rounded-full flex items-center justify-center border border-pink-400/30 animate-pulse"
                style={{
                  transform: `perspective(1000px) rotateX(${mousePosition.y * 5}deg) rotateY(${mousePosition.x * 5}deg)`,
                }}
              >
                <Heart className="w-12 h-12 text-pink-400 fill-current" />
              </div>

              {/* Main Title */}
              <h1 
                className="text-white tracking-light text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6"
                style={{
                  textShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
                  transform: `perspective(1000px) rotateX(${mousePosition.y * 2}deg) rotateY(${mousePosition.x * 2}deg)`,
                }}
              >
                Thank You for Using{' '}
                <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text">
                  CineMatch
                </span>
                !
              </h1>

              {/* Subtitle */}
              <p 
                className="text-[#9cabba] text-lg md:text-xl font-normal leading-relaxed mb-8 max-w-lg mx-auto"
                style={{
                  transform: `perspective(1000px) rotateX(${mousePosition.y * 1}deg) rotateY(${mousePosition.x * 1}deg)`,
                }}
              >
                We hope you enjoyed our personalized movie suggestions and discovered your next favorite film. 
                Your cinematic journey matters to us!
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <button
                  onClick={() => navigate('/')}
                  className="group flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
                >
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  <span>Back to Home</span>
                </button>
                
                <button
                  onClick={() => navigate('/saved')}
                  className="group flex items-center justify-center gap-3 bg-[#283039] hover:bg-[#3a424d] text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 border border-[#3a424d] hover:border-blue-500/50"
                >
                  <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>View Saved Movies</span>
                </button>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="group bg-gradient-to-br from-[#283039] to-[#1e252b] rounded-xl p-6 border border-[#3a424d] hover:border-blue-500/30 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10"
                  style={{
                    transform: `perspective(1000px) rotateX(${mousePosition.y * 1}deg) rotateY(${mousePosition.x * 1}deg)`,
                    animationDelay: `${index * 0.2}s`,
                  }}
                >
                  <div className="text-center">
                    <div className="mx-auto mb-4 w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <stat.icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {stat.value}
                    </div>
                    <div className="text-[#9cabba] text-sm font-medium">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Message */}
            <div className="text-center bg-gradient-to-r from-[#283039]/50 to-[#1e252b]/50 rounded-xl p-8 border border-[#3a424d]/50 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-semibold">Keep Exploring</span>
                <Sparkles className="w-5 h-5 text-yellow-400" />
              </div>
              <p className="text-[#9cabba] text-base leading-relaxed">
                Come back anytime for more personalized recommendations. 
                <br className="hidden sm:block" />
                Happy watching! 🎬✨
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;