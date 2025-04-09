import React from 'react';

const MusicLoading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="relative w-24 h-24 mb-4">
        {/* Music note */}
        <div className="absolute top-0 left-0 w-8 h-8 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute top-0 left-0 w-8 h-8 border-4 border-blue-500 rounded-full border-t-transparent animate-spin" style={{ animationDelay: '0.2s' }}></div>
        <div className="absolute top-0 left-0 w-8 h-8 border-4 border-blue-500 rounded-full border-t-transparent animate-spin" style={{ animationDelay: '0.4s' }}></div>
        
        {/* Music staff lines */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-blue-500"></div>
          <div className="absolute top-1/3 left-0 w-full h-0.5 bg-blue-500"></div>
          <div className="absolute top-2/3 left-0 w-full h-0.5 bg-blue-500"></div>
          <div className="absolute top-full left-0 w-full h-0.5 bg-blue-500"></div>
        </div>
      </div>
      <p className="text-blue-500 font-medium">Loading...</p>
    </div>
  );
};

export default MusicLoading; 