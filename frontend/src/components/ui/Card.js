export const Card = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`bg-mint-50 rounded-lg border border-mint-300 shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export const CardHeader = ({ children, className = "", ...props }) => {
  return (
    <div className={`p-6 pb-4 ${className}`} {...props}>
      {children}
    </div>
  )
}

export const CardTitle = ({ children, className = "", ...props }) => {
  return (
    <h3 className={`text-lg font-semibold text-mint-700 ${className}`} {...props}>
      {children}
    </h3>
  )
}

export const CardContent = ({ children, className = "", ...props }) => {
  return (
    <div className={`p-6 pt-0 text-mint-600 ${className}`} {...props}>
      {children}
    </div>
  )
}
