// components/ui/Input.jsx
import React from 'react';

export const Input = React.forwardRef(({ className = "", ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`flex h-12 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm text-white placeholder:text-teal-100/30 transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-400 focus:bg-white/10
        disabled:cursor-not-allowed disabled:opacity-50 backdrop-blur-md shadow-inner ${className}`}
      {...props}
    />
  );
});

Input.displayName = 'Input';
