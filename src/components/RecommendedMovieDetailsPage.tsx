import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Search, Bell, Star, Calendar, Clock, ExternalLink } from 'lucide-react';

interface RecommendedMovie {
  title: string;
  year: string;
  imdbRating: string;
  genre: string;
  actors: string;
  plot: string;
  poster: string;
}

const RecommendedMovieDetailsPage: React.FC = () => {
  const { movieTitle } = useParams<{ movieTitle: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get movie from location state
  const movie = location.state?.movie as RecommendedMovie;

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#121416] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Movie not found</h1>
          <button 
            onClick={() => navigate(-1)}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleIMDbClick = () => {
    const imdbUrl = `https://www.imdb.com/find/?q=${encodeURIComponent(movie.title + ' ' + movie.year)}`;
    window.open(imdbUrl, '_blank');
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#121416] text-white overflow-x-hidden" style={{ fontFamily: '"Space Grotesk", "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#2c3135] px-4 md:px-10 py-3">
          <div className="flex items-center gap-8">
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
            <div className="hidden md:flex items-center gap-9">
              <button 
                onClick={() => navigate('/')}
                className="text-white text-sm font-medium leading-normal hover:text-blue-400 transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => navigate(-1)}
                className="text-purple-400 text-sm font-medium leading-normal flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                Back
              </button>
            </div>
          </div>
          <div className="flex flex-1 justify-end gap-4 md:gap-8">
            <label className="hidden md:flex flex-col min-w-40 !h-10 max-w-64">
              <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                <div className="text-[#a2abb3] flex border-none bg-[#2c3135] items-center justify-center pl-4 rounded-l-xl border-r-0">
                  <Search size={20} />
                </div>
                <input
                  placeholder="Search"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border-none bg-[#2c3135] focus:border-none h-full placeholder:text-[#a2abb3] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                />
              </div>
            </label>
            <button className="flex cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 bg-[#2c3135] text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5 hover:bg-[#3a424d] transition-colors">
              <Bell size={20} />
            </button>
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
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            {/* Back Button for Mobile */}
            <button 
              onClick={() => navigate(-1)}
              className="md:hidden flex items-center gap-2 text-white mb-4 hover:text-purple-400 transition-colors"
            >
              <ArrowLeft size={20} />
              Back
            </button>

            {/* Movie Details Card */}
            <div className="p-4">
              <div className="flex flex-col items-stretch justify-start rounded-xl xl:flex-row xl:items-start gap-6">
                <div className="w-full aspect-video rounded-xl xl:max-w-md relative overflow-hidden">
                  <img 
                    src={movie.poster} 
                    alt={`${movie.title} poster`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1";
                    }}
                  />
                </div>
                <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-4 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <h1 className="text-white text-2xl md:text-3xl font-bold leading-tight tracking-[-0.015em]">
                      {movie.title}
                    </h1>
                    <div className="flex items-center gap-2">
                      <span className="bg-purple-600 text-white text-sm font-medium px-3 py-1 rounded-full whitespace-nowrap">
                        {movie.genre.split(',')[0].trim()}
                      </span>
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-xs">{movie.imdbRating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-4 text-[#9cabba] text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{movie.year}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{Math.floor(90 + Math.random() * 60)}m</span>
                      </div>
                    </div>
                    
                    <p className="text-[#a2abb3] text-base font-normal leading-normal">
                      {movie.plot}
                    </p>
                    
                    <div className="text-[#9cabba] text-sm">
                      <p className="font-medium mb-1">Starring:</p>
                      <p>{movie.actors}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={handleIMDbClick}
                      className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                    >
                      <ExternalLink size={16} />
                      View on IMDb
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="px-4 py-6">
              <div className="bg-[#2c3135] rounded-xl p-6">
                <h3 className="text-white text-lg font-bold mb-4">Movie Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-[#a2abb3]">Genre:</span>
                    <span className="text-white ml-2">{movie.genre}</span>
                  </div>
                  <div>
                    <span className="text-[#a2abb3]">Year:</span>
                    <span className="text-white ml-2">{movie.year}</span>
                  </div>
                  <div>
                    <span className="text-[#a2abb3]">IMDb Rating:</span>
                    <span className="text-white ml-2">★ {movie.imdbRating}</span>
                  </div>
                  <div>
                    <span className="text-[#a2abb3]">Cast:</span>
                    <span className="text-white ml-2">{movie.actors}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendedMovieDetailsPage;