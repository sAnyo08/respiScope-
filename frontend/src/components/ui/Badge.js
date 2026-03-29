export const Badge = ({ children, variant = "default", className = "", ...props }) => {
  const variants = {
    default: "bg-teal-500/20 text-teal-300 border border-teal-500/30 shadow-[0_0_10px_rgba(20,184,166,0.2)]",
    secondary: "bg-white/10 text-gray-300 border border-white/20",
    destructive: "bg-red-500/20 text-red-400 border border-red-500/30",
    success: "bg-green-500/20 text-green-400 border border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]",
    warning: "bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${variants[variant] || variants.default} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}