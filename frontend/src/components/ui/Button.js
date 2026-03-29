// components/ui/Button.jsx
export const Button = ({
  children,
  variant = "default",
  size = "default",
  className = "",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 " +
    "disabled:opacity-50 disabled:pointer-events-none shadow-lg active:scale-95";

  const variants = {
    // Glass default: Vibrant gradient with glow
    default: "bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-400 hover:to-emerald-400 border border-white/10 shadow-[0_0_15px_rgba(20,184,166,0.2)]",
    // Destructive: Red glass
    destructive: "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30",
    // Outline: Glass border
    outline: "border border-teal-400/50 bg-white/5 text-teal-300 hover:bg-white/10 hover:border-teal-300 backdrop-blur-md",
    // Secondary: Subtler glass
    secondary: "bg-teal-500/10 text-teal-300 border border-teal-500/20 hover:bg-teal-500/20",
    // Ghost: No background until hover
    ghost: "text-teal-300 hover:bg-white/10 hover:text-teal-200",
  };

  const sizes = {
    default: "h-10 px-4 py-2 text-sm",
    sm: "h-9 px-3 py-1.5 text-sm",
    lg: "h-12 px-6 py-3 text-base",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
