// components/ui/Card.jsx
export const Card = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`relative overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] rounded-2xl ${className}`}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export const CardHeader = ({ children, className = "", ...props }) => {
  return (
    <div className={`p-6 pb-4 border-b border-white/10 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardTitle = ({ children, className = "", ...props }) => {
  return (
    <h3 className={`text-lg font-bold text-white ${className}`} {...props}>
      {children}
    </h3>
  );
};

export const CardContent = ({ children, className = "", ...props }) => {
  return (
    <div className={`p-6 pt-6 text-teal-50/80 ${className}`} {...props}>
      {children}
    </div>
  );
};
