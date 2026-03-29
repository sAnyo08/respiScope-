"use client"

import { useState, createContext, useContext } from "react"

const TabsContext = createContext()

export const Tabs = ({ children, defaultValue, className = "", ...props }) => {
  const [activeTab, setActiveTab] = useState(defaultValue)

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

export const TabsList = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`inline-flex h-12 items-center justify-center rounded-xl bg-white/5 backdrop-blur-md border border-white/10 p-1 text-teal-100/60 shadow-inner ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export const TabsTrigger = ({ children, value, className = "", ...props }) => {
  const { activeTab, setActiveTab } = useContext(TabsContext)
  const isActive = activeTab === value

  return (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 disabled:pointer-events-none disabled:opacity-50 ${
        isActive
          ? "bg-gradient-to-r from-teal-500/80 to-emerald-500/80 text-white shadow-[0_0_15px_rgba(20,184,166,0.5)] border border-teal-300/50"
          : "text-teal-100/60 hover:text-white hover:bg-white/5 active:scale-95"
      } ${className}`}
      onClick={() => setActiveTab(value)}
      {...props}
    >
      {children}
    </button>
  )
}

export const TabsContent = ({ children, value, className = "", ...props }) => {
  const { activeTab } = useContext(TabsContext)

  if (activeTab !== value) return null

  return (
    <div
      className={`mt-4 ring-offset-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 ${className}`}
      {...props}
    >
      <div className="animate-in fade-in zoom-in-95 duration-300">
        {children}
      </div>
    </div>
  )
}
