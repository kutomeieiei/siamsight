import React from 'react';

interface LoadingSpinnerProps {
  size?: number;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 8 }) => {
  return (
    <div className={`w-${size} h-${size} border-2 border-purple-800 border-t-yellow-400 border-solid rounded-full animate-spin`}></div>
  );
};

export default LoadingSpinner;