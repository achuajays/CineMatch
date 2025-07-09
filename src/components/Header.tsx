import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Bookmark, Heart, Eye, Menu, X, ThumbsDown } from 'lucide-react';
import { getSavedMoviesCount, isStorageEnabled } from '../services/storageService';
import { getWatchedMoviesCount } from '../services/watchedMoviesService';
import { getDislikedMoviesCount } from '../services/dislikedMoviesService';

interface HeaderProps {
  onSettingsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSettingsClick }) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Memoize counts to prevent unnecessary recalculations
  const counts = useMemo(() => ({
    saved: isStorageEnabled() ? getSavedMoviesCount() : 0,
    watched: getWatchedMoviesCount(),
    disliked: getDislikedMoviesCount(),
  }), []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const handleNavigation = useCallback((path: string) => {
    navigate(path);
    closeMobileMenu();
  }, [navigate, closeMobileMenu]);

  const handleSettingsClick = useCallback(() => {
    onSettingsClick();
    closeMobileMenu();
  }, [onSettingsClick, closeMobileMenu]);

  // Memoized badge component for better performance
  const Badge = React.memo(({ count, color }: { count: number; color: string }) => {
    if (count === 0) return null;
    
    return (
      <span className={`absolute -top-1 -right-1 ${color} text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center transform scale-100 animate-pulse`}>
        {count > 99 ? '99+' : count}
      </span>
    );
  });

  // Memoized navigation button component
  const NavButton = React.memo(({ 
    icon: Icon, 
    onClick, 
    badge, 
    className = '',
    title 
  }: {
    icon: React.ComponentType<any>;
    onClick: () => void;
    badge?: React.ReactNode;
    className?: string;
    title?: string;
  }) => (
    <button 
      onClick={onClick}
      className={`relative flex cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 bg-[#283039] text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5 hover:bg-[#3a424d] transition-all duration-200 transform hover:scale-105 active:scale-95 ${className}`}
      title={title}
    >
      <Icon className="text-white" size={20} />
      {badge}
    </button>
  ));

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#283039] px-4 md:px-10 py-3 bg-[#111418]/95 backdrop-blur-md">
        {/* Logo Section - Optimized */}
        <div className="flex items-center gap-4 text-white">
          <div className="size-8 md:size-10 transform hover:scale-110 transition-transform duration-200">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
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
          <h1 className="text-white text-xl md:text-2xl font-bold leading-tight tracking-[-0.015em] bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
            CineMatch
          </h1>
        </div>

        {/* Desktop Navigation - Optimized */}
        <div className="hidden md:flex flex-1 justify-end gap-3 lg:gap-4">
          {isStorageEnabled() && (
            <NavButton
              icon={Bookmark}
              onClick={() => navigate('/saved')}
              badge={<Badge count={counts.saved} color="bg-blue-600" />}
              title="Saved Movies"
            />
          )}
          
          <NavButton
            icon={Eye}
            onClick={() => navigate('/watched')}
            badge={<Badge count={counts.watched} color="bg-green-600" />}
            title="Watched Movies"
          />
          
          <NavButton
            icon={ThumbsDown}
            onClick={() => navigate('/disliked')}
            badge={<Badge count={counts.disliked} color="bg-red-600" />}
            title="Disliked Movies"
          />
          
          <NavButton
            icon={Heart}
            onClick={() => navigate('/thank-you')}
            className="bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700"
            title="Thank You Page"
          />
          
          <NavButton
            icon={Settings}
            onClick={onSettingsClick}
            title="Settings"
          />

          {/* Profile Avatar - Enhanced */}
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 hover:ring-2 hover:ring-blue-400/50 transition-all duration-200 cursor-pointer transform hover:scale-110 shadow-lg"
            style={{
              backgroundImage: 'url("https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1")'
            }}
          />
        </div>

        {/* Mobile Section - Optimized */}
        <div className="md:hidden flex items-center gap-2">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8 hover:ring-2 hover:ring-blue-400/50 transition-all duration-200 cursor-pointer"
            style={{
              backgroundImage: 'url("https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1")'
            }}
          />
          <button
            onClick={toggleMobileMenu}
            className="flex cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 w-10 bg-[#283039] text-white hover:bg-[#3a424d] transition-all duration-200 transform hover:scale-105 active:scale-95"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay - Optimized */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop with blur effect */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
            onClick={closeMobileMenu}
          />
          
          {/* Mobile Menu - Enhanced */}
          <div className="fixed top-[73px] right-0 w-72 bg-[#1a1f24]/95 backdrop-blur-md border-l border-[#283039] z-50 md:hidden shadow-2xl transform transition-transform duration-300 ease-out">
            <div className="flex flex-col p-4 space-y-3 max-h-[calc(100vh-73px)] overflow-y-auto">
              {/* Navigation Items */}
              {isStorageEnabled() && (
                <button 
                  onClick={() => handleNavigation('/saved')}
                  className="relative flex items-center gap-3 w-full p-4 rounded-xl bg-[#283039] hover:bg-[#3a424d] text-white transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Bookmark size={20} />
                  <span className="font-medium">Saved Movies</span>
                  {counts.saved > 0 && (
                    <span className="ml-auto bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      {counts.saved > 99 ? '99+' : counts.saved}
                    </span>
                  )}
                </button>
              )}
              
              <button 
                onClick={() => handleNavigation('/watched')}
                className="relative flex items-center gap-3 w-full p-4 rounded-xl bg-[#283039] hover:bg-[#3a424d] text-white transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Eye size={20} />
                <span className="font-medium">Watched Movies</span>
                {counts.watched > 0 && (
                  <span className="ml-auto bg-green-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {counts.watched > 99 ? '99+' : counts.watched}
                  </span>
                )}
              </button>
              
              <button 
                onClick={() => handleNavigation('/disliked')}
                className="relative flex items-center gap-3 w-full p-4 rounded-xl bg-[#283039] hover:bg-[#3a424d] text-white transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <ThumbsDown size={20} />
                <span className="font-medium">Disliked Movies</span>
                {counts.disliked > 0 && (
                  <span className="ml-auto bg-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {counts.disliked > 99 ? '99+' : counts.disliked}
                  </span>
                )}
              </button>
              
              <button 
                onClick={() => handleNavigation('/thank-you')}
                className="flex items-center gap-3 w-full p-4 rounded-xl bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 text-white transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Heart className="fill-current" size={20} />
                <span className="font-medium">Thank You</span>
              </button>
              
              <div className="border-t border-[#3a424d] my-2" />
              
              <button 
                onClick={handleSettingsClick}
                className="flex items-center gap-3 w-full p-4 rounded-xl bg-[#283039] hover:bg-[#3a424d] text-white transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Settings size={20} />
                <span className="font-medium">Settings</span>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header;