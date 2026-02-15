// components/ui/Button.jsx
export const Button = ({
  children,
  variant = "default",
  size = "default",
  className = "",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 " +
    "disabled:opacity-50 disabled:pointer-events-none shadow-md";

  const variants = {
    default: "bg-teal-500 text-white hover:bg-teal-600",
    destructive: "bg-red-500 text-white hover:bg-red-600",
    outline: "border border-teal-400 bg-white text-teal-600 hover:bg-teal-50",
    secondary: "bg-teal-100 text-teal-900 hover:bg-teal-200",
    ghost: "text-teal-600 hover:bg-teal-50",
  };

  const sizes = {
    default: "h-10 px-4 text-sm",
    sm: "h-9 px-3 text-sm",
    lg: "h-11 px-6 text-base",
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
