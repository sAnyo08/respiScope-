import React from 'react'
import { useNavigate } from "react-router-dom"
import { Button } from "../ui/Button"
import { Home, Mic, User, Users, Clock, LogOut, Activity, UserCheck, Calendar, Stethoscope, Menu } from "lucide-react"

const Navbar = ({ userType = "doctor", userName = "User", userCode = "CODE123" }) => {
  const navigate = useNavigate()

  const handleLogout = () => navigate("/")
  
  return (
    <header className="bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-600 shadow-lg border-b-4 border-teal-700">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-20">
        {/* Logo & Title Section */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
              <Stethoscope className="w-7 h-7 text-teal-600" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">RespiScope</h1>
            <p className="text-sm text-teal-100 font-medium flex items-center gap-1">
              <span className="w-2 h-2 bg-teal-200 rounded-full"></span>
              {userType === "doctor" ? "Doctor Portal" : userType === "patient" ? "Patient Portal" : "Healthcare Platform"}
            </p>
          </div>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center space-x-6">
          {/* User Info Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20 hover:bg-white/20 transition-colors">
            <div className="text-right">
              <p className="text-sm font-bold text-white">{userName}</p>
              <p className="text-xs text-teal-100">ID: {userCode}</p>
            </div>
          </div>

          {/* Logout Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout} 
            className="bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 hover:shadow-lg group"
          >
            <LogOut className="h-4 w-4 group-hover:rotate-12 transition-transform" />
            <span className="font-medium">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Navbar