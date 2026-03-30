import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { 
  Menu, Moon, Users, TrendingUp, UserPlus, User, Trash2, 
  Settings, FileText, Wifi 
} from 'lucide-react';

const AdminDashboard = () => {
  const [data, setData] = useState({ totalUsers: 0, users: [], recentLogs: [] });
  const [loading, setLoading] = useState(true);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [totalPatients, setTotalPatients] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/dashboard', {
          withCredentials: true
        });
        setData(response.data);
        setTotalDoctors(response.data.totalDoctors);
        setTotalPatients(response.data.totalPatients);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 60000); // in minutes
    if (diff < 60) return `${diff}M AGO`;
    if (diff < 1440) return `${Math.floor(diff / 60)}H AGO`;
    return `${Math.floor(diff / 1440)}D AGO`;
  };

  return (
    <div className="min-h-screen bg-[#0b101e] text-gray-100 font-sans pb-24">
      <Helmet>
        <title>Admin Dashboard | RespiScope</title>
        <meta name="description" content="System Administrator control panel" />
      </Helmet>
      
      {/* Top Header */}
      <header className="flex justify-between items-center p-6 bg-[#131c2f]/40">
        <div className="flex items-center gap-4">
          <Menu className="text-teal-400 w-6 h-6 cursor-pointer" />
          <h1 className="text-xl font-bold leading-tight">
            RespiScope | System Admin | Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Moon className="text-cyan-400 w-6 h-6 cursor-pointer" />
          <div className="w-10 h-10 rounded-full bg-slate-700 border-2 border-slate-500 overflow-hidden">
            {/* Using a placeholder avatar representing the image */}
            <div className="w-full h-full bg-amber-200/20 flex justify-center pt-2">
              <User className="w-6 h-6 text-amber-200/80" />
            </div>
          </div>
        </div>
      </header>
      
      <main className="px-2 space-y-6 mt-6 max-w-lg mx-auto md:max-w-7xl">
        
        {/* Stats Slider / Top Section */}
        <div className="flex space-x-4 overflow-x-auto pb-2 snap-x hide-scrollbar">
          <div className="min-w-[85%] md:min-w-[300px] bg-[#131c2f] rounded-2xl p-6 border border-white/5 shadow-lg snap-center flex-shrink-0">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Total Users</p>
                <h2 className="text-4xl font-bold mt-1">
                  {loading ? "..." : (data.totalUsers || "1,240")}
                </h2>
              </div>
              <Users className="w-6 h-6 text-cyan-400 mt-2" />
            </div>
            <div className="flex items-center gap-2 mt-6 text-xs text-teal-400 font-medium">
              <TrendingUp className="w-3 h-3" />
              <span>+12% FROM LAST MONTH</span>
            </div>
          </div>
          <div className="min-w-[85%] md:min-w-[300px] bg-[#131c2f] rounded-2xl p-6 border border-white/5 shadow-lg snap-center flex-shrink-0">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Total Doctors</p>
                <h2 className="text-4xl font-bold mt-1">
                  {loading ? "..." : (totalDoctors || "1,240")}
                </h2>
              </div>
              <Users className="w-6 h-6 text-cyan-400 mt-2" />
            </div>
            <div className="flex items-center gap-2 mt-6 text-xs text-teal-400 font-medium">
              <TrendingUp className="w-3 h-3" />
              <span>+120% FROM LAST MONTH</span>
            </div>
          </div>
          <div className="min-w-[85%] md:min-w-[300px] bg-[#131c2f] rounded-2xl p-6 border border-white/5 shadow-lg snap-center flex-shrink-0">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Total Patients</p>
                <h2 className="text-4xl font-bold mt-1">
                  {loading ? "..." : (totalPatients || "1,240")}
                </h2>
              </div>
              <Users className="w-6 h-6 text-cyan-400 mt-2" />
            </div>
            <div className="flex items-center gap-2 mt-6 text-xs text-teal-400 font-medium">
              <TrendingUp className="w-3 h-3" />
              <span>+260% FROM LAST MONTH</span>
            </div>
          </div>

          {/* Dummy visual second card as in design */}
          <div className="min-w-[85%] md:min-w-[300px] bg-[#131c2f] rounded-2xl p-6 border border-white/5 shadow-lg snap-center flex-shrink-0 opacity-50">
            <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Active Consultations</p>
            <h2 className="text-4xl font-bold mt-1">45</h2>
          </div>
        </div>

        {/* Users Management */}
        <div className="bg-[#131c2f] rounded-3xl p-6 border border-white/5 shadow-lg">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-lg font-bold">Users Management</h2>
              <p className="text-xs text-slate-400 mt-1">Manage and audit system | access levels</p>
            </div>
            <button className="bg-cyan-400 hover:bg-cyan-300 text-[#0b101e] px-4 py-2 rounded-xl text-xs font-bold leading-tight shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all">
              ADD NEW<br/>USER
            </button>
          </div>

          <div className="grid grid-cols-12 text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-4 border-b border-white/5 pb-2">
            <div className="col-span-8">User Profile</div>
            <div className="col-span-4 text-right pr-2">Role</div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <p className="text-sm text-slate-500">Loading users...</p>
            ) : data.users.slice(0, 3).map((user, i) => (
              <div key={user.id || i} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#0b101e] flex items-center justify-center shadow-inner">
                    <User className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{user.name}</h3>
                    <p className="text-[10px] text-slate-400">{user.identifier || "no-email@respi.net"}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-lg border text-[10px] font-bold tracking-wider uppercase
                  ${user.role === 'DOCTOR' 
                    ? 'border-cyan-500/30 text-cyan-300 bg-cyan-950/20' 
                    : 'border-slate-500/30 text-slate-300 bg-slate-800/20'}`}>
                  {user.role}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Logs */}
        <div className="bg-[#131c2f] rounded-3xl p-6 border border-white/5 shadow-lg relative">
          <div className="absolute right-6 top-6">
             <Wifi className="w-6 h-6 text-cyan-400" />
          </div>
          <h2 className="text-lg font-bold">Recent Logs</h2>
          <p className="text-xs text-slate-400 mt-1 mb-6">Live consultation pulse</p>

          <div className="space-y-4">
            {loading ? (
              <p className="text-sm text-slate-500">Loading logs...</p>
            ) : data.recentLogs.slice(0, 3).map((log, i) => {
              // Derive status for visual styling mock
              let statusLabel = log.status === 'closed' ? 'COMPLETE' : (log.status === 'active' ? 'IN PROGRESS' : 'PENDING');
              let statusColor = "text-slate-300";
              if (log.status === 'active') statusColor = "text-cyan-400";
              if (log.status === 'closed') statusColor = "text-slate-400";
              // We'll mock a critical alert just for visual completeness if it's the 3rd item
              if (i === 2 && data.recentLogs.length > 2) {
                statusLabel = "CRITICAL ALERT";
                statusColor = "text-red-400";
              }

              const docName = log.doctorId?.name ? log.doctorId.name.toUpperCase() : "DOCTOR";
              const patName = log.patientId?.name ? log.patientId.name.toUpperCase() : "PATIENT";

              return (
                <div key={log._id || i} className="border-b border-white/5 pb-4 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-bold">Consultation #{log._id ? log._id.substring(18) : "9482"}</h3>
                      <p className="text-[10px] text-slate-400 mt-1 uppercase">
                        {docName} ↔ {patName}
                      </p>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400">
                      {formatTimeAgo(log.createdAt || new Date())}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className={`text-[10px] font-bold tracking-wider ${statusColor}`}>
                      {statusLabel}
                    </span>
                    <div className='text-red-500/70 hover:text-red-400 cursor-pointer flex items-center gap-2 border border-red-500/70 rounded-xl px-2 py-1'>
                    <Trash2 className="w-4 h-4 text-red-500/70 hover:text-red-400 cursor-pointer" />Delete</div>
                  </div>
                </div>
              );
            })}
          </div>

          <button className="w-full mt-4 py-3 rounded-xl bg-[#0b101e] hover:bg-slate-900 border border-white/5 text-[10px] font-bold tracking-widest text-cyan-400 uppercase transition-colors">
            View All Activity Logs
          </button>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full bg-[#131c2f] border-t border-white/5 px-6 py-4 flex justify-between items-center rounded-t-3xl max-w-lg mx-auto md:max-w-4xl right-0 mx-auto">
        <button className="flex flex-col items-center gap-1 opacity-100 bg-slate-800/50 px-6 py-2 rounded-2xl">
          <Users className="w-6 h-6 text-cyan-400" />
          <span className="text-[10px] font-bold tracking-wider text-cyan-400">USERS</span>
        </button>
        <button className="flex flex-col items-center gap-1 opacity-50 hover:opacity-100 transition-opacity">
          <FileText className="w-6 h-6 text-slate-400" />
          <span className="text-[10px] font-bold tracking-wider text-slate-400">LOGS</span>
        </button>
        <button className="flex flex-col items-center gap-1 opacity-50 hover:opacity-100 transition-opacity">
          <Settings className="w-6 h-6 text-slate-400" />
          <span className="text-[10px] font-bold tracking-wider text-slate-400">SETTINGS</span>
        </button>
      </nav>

      {/* Hide scrollbar styles locally */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default AdminDashboard;
