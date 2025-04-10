import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white dark:bg-neutral-900 bg-opacity-90 dark:bg-opacity-90 z-50 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
        <p className="text-neutral-600 dark:text-neutral-400 text-lg">載入中...</p>
      </div>
    </div>
  );
};

export default LoadingScreen; 