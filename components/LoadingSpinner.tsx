
import React from 'react';

interface LoadingSpinnerProps {
  size?: number;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 8 }) => {
  return (
    <div className={`w-${size} h-${size} border-2 border-slate-700 border-t-yellow-500 border-solid rounded-full animate-spin`}></div>
  );
};

export default LoadingSpinner;