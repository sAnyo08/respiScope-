import React from 'react'
import { useNavigate } from "react-router-dom"
import { Button } from "../ui/Button"
import { Home, Mic, User, Users, Clock, LogOut, Activity, UserCheck, Calendar, Stethoscope } from "lucide-react"

const Navbar = () => {
  const navigate = useNavigate()

  const handleLogout = () => navigate("/")
  return (
    <div>
      <header className="bg-mint-600 shadow-md border-b border-mint-700">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
        <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg"><Stethoscope /></span>
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-xl font-semibold text-gray-900">RespiScope</h1>
                <p className="text-sm text-gray-500">Doctor Portal</p>
              </div>
            </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-mint-50">Dr. Adarsh</p>
              <p className="text-xs text-mint-200">Code: DOC579789</p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center space-x-1">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>

          </div>
        </div>
      </header>
    </div>
  )
}

export default Navbar
