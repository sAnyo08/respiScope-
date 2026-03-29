import React from 'react';
import { motion } from 'framer-motion';

const ErrorComponent = ({ title = "An Error Occurred", message = "Something went wrong.", onRetry }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center p-6 m-4 backdrop-blur-md bg-red-500/10 dark:bg-red-500/5 border border-red-500/30 rounded-2xl shadow-lg ring-1 ring-black/5 dark:ring-white/5 max-w-md mx-auto"
    >
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-500/20 text-red-500 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2 text-center font-manrope">{title}</h3>
      <p className="text-gray-700 dark:text-gray-300 text-center mb-6">{message}</p>
      
      {onRetry && (
        <button 
          onClick={onRetry}
          className="px-6 py-2 rounded-xl font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all shadow-md active:scale-95"
        >
          Try Again
        </button>
      )}
    </motion.div>
  );
};

export default ErrorComponent;
