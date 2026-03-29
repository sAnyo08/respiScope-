import React from 'react';
import { Helmet } from 'react-helmet';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-[#10141a] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Helmet>
        <title>Admin Dashboard | RespiScope</title>
        <meta name="description" content="System Administrator control panel for managing users and consultations." />
      </Helmet>
      
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex justify-between items-center backdrop-blur-md bg-white/30 dark:bg-white/5 p-6 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
          <h1 className="text-3xl font-bold font-manrope">System Admin Dashboard</h1>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Total Users: 1240', 'Active Consultations: 45', 'System Status: Optimal'].map((stat, i) => (
            <div key={i} className="p-6 rounded-xl backdrop-blur-md bg-white/40 dark:bg-white/5 border border-gray-200 dark:border-white/10">
              <h3 className="text-xl font-semibold opacity-80">{stat}</h3>
            </div>
          ))}
        </div>
        
        <div className="rounded-2xl overflow-hidden backdrop-blur-md bg-white/40 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-6">
          <h2 className="text-2xl font-bold mb-4 font-manrope">User Management</h2>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-300 dark:border-white/10 opacity-70">
                <th className="py-3">Name</th>
                <th className="py-3">Role</th>
                <th className="py-3">Status</th>
                <th className="py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Mock accounts */}
              {['Dr. Sarah', 'John Doe'].map((user, i) => (
                <tr key={i} className="border-b border-gray-100 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <td className="py-4">{user}</td>
                  <td className="py-4 opacity-80">{i === 0 ? 'Doctor' : 'Patient'}</td>
                  <td className="py-4 text-green-600 dark:text-teal-400">Active</td>
                  <td className="py-4 text-right space-x-3">
                    <button className="text-blue-500 hover:text-blue-600">Edit</button>
                    <button className="text-red-500 hover:text-red-600 font-medium">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
