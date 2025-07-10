import React, { useState } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const FloatingChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m your movie assistant. Ask me anything about movies, stories, or recommendations!',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      
      // Check if API URL is configured
      if (!apiUrl) {
        throw new Error('API URL not configured');
      }
      
      const fullApiUrl = `${apiUrl}/query`;
      
      const response = await fetch(`${apiUrl}/query/`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `${inputValue} and also only answer related to drama , series and movie and all other questions must be said "i dont have that contest of the question"`
        }),
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: data.answer || 'Sorry, I couldn\'t process your request.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.warn('API unavailable, using fallback response:', error);
      
      // Always fallback to demo response if API fails
      const fallbackMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: generateMovieResponse(inputValue),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMovieResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    // Movie recommendations
    if (lowerQuery.includes('recommend') || lowerQuery.includes('suggest')) {
      const genres = ['action', 'comedy', 'drama', 'thriller', 'sci-fi', 'horror', 'romance'];
      const detectedGenre = genres.find(genre => lowerQuery.includes(genre));
      
      if (detectedGenre) {
        const recommendations = {
          action: ['Mad Max: Fury Road', 'John Wick', 'The Dark Knight', 'Mission: Impossible'],
          comedy: ['The Grand Budapest Hotel', 'Superbad', 'Knives Out', 'The Nice Guys'],
          drama: ['Parasite', 'Moonlight', 'Manchester by the Sea', 'Lady Bird'],
          thriller: ['Gone Girl', 'Zodiac', 'No Country for Old Men', 'Prisoners'],
          'sci-fi': ['Blade Runner 2049', 'Arrival', 'Ex Machina', 'Interstellar'],
          horror: ['Hereditary', 'The Conjuring', 'Get Out', 'A Quiet Place'],
          romance: ['Call Me by Your Name', 'The Shape of Water', 'Her', 'Before Sunset']
        };
        
        const movies = recommendations[detectedGenre as keyof typeof recommendations];
        return `Here are some great ${detectedGenre} movies I'd recommend: ${movies.slice(0, 3).join(', ')}. Would you like more details about any of these?`;
      }
      
      return 'I\'d be happy to recommend movies! What genre are you in the mood for? Action, comedy, drama, thriller, sci-fi, horror, or romance?';
    }
    
    // Movie information
    if (lowerQuery.includes('about') || lowerQuery.includes('tell me')) {
      return 'I can help you learn about movies! Try asking me about specific films, directors, or genres. For example: "Tell me about Inception" or "What are some good Christopher Nolan movies?"';
    }
    
    // Popular movies
    if (lowerQuery.includes('popular') || lowerQuery.includes('trending')) {
      return 'Some currently popular movies include Dune: Part Two, Oppenheimer, Barbie, Spider-Man: Across the Spider-Verse, and The Batman. What type of popular movies are you interested in?';
    }
    
    // Directors
    if (lowerQuery.includes('director') || lowerQuery.includes('nolan') || lowerQuery.includes('tarantino') || lowerQuery.includes('scorsese')) {
      return 'Great directors make great films! Some acclaimed directors include Christopher Nolan (Inception, Interstellar), Quentin Tarantino (Pulp Fiction, Django Unchained), and Martin Scorsese (Goodfellas, The Departed). Which director interests you?';
    }
    
    // Default responses
    const defaultResponses = [
      'That\'s an interesting question about movies! I can help you discover new films, learn about directors, or find movies in specific genres.',
      'I love talking about movies! Feel free to ask me about recommendations, movie trivia, or anything film-related.',
      'Movies are amazing! What would you like to know? I can suggest films based on your preferences or tell you about different genres.',
      'I\'m here to help with all things movies! Ask me about recommendations, popular films, or specific genres you enjoy.'
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
        >
          {isOpen ? (
            <X size={28} className="transition-transform duration-200" />
          ) : (
            <MessageCircle size={28} className="transition-transform duration-200" />
          )}
          
          {/* Pulse animation when closed */}
          {!isOpen && (
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 animate-ping opacity-20" />
          )}
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
            {isOpen ? 'Close Chat' : 'Ask me anything!'}
          </div>
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-28 right-6 z-50 w-96 h-[500px] bg-[#283039] rounded-xl shadow-2xl border border-[#3a424d] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-xl">Movie Assistant</h3>
                <p className="text-sm opacity-90">Ask me about movies & stories</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#1a1f24]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-[#283039] text-white border border-[#3a424d]'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                  <p className={`text-xs mt-1 opacity-70 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-[#9cabba]'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#283039] text-white border border-[#3a424d] p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Loader2 size={18} className="animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-5 bg-[#283039] border-t border-[#3a424d]">
            <div className="flex gap-3">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about movies, stories..."
                className="flex-1 bg-[#1a1f24] text-white rounded-lg px-4 py-3 border border-[#3a424d] focus:border-blue-500 focus:outline-none transition-colors resize-none text-sm"
                rows={2}
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[48px]"
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChatbot;