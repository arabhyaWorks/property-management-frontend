import React from 'react';
import { Camera, Mail, Phone, Building2, LogOut, CalendarDays, Shield } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function ProfileSettings() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="p-6 space-y-8">
      {/* Profile Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <img
              src="https://static.vecteezy.com/system/resources/thumbnails/005/129/844/small_2x/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg"
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover ring-4 ring-white dark:ring-gray-800"
            />
            <button className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white hover:bg-blue-700 shadow-lg transition-transform hover:scale-110">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.name || 'User'}</h2>
            <p className="text-gray-500 dark:text-gray-400">{user?.role || 'User'}</p>
            <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {user?.role}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <Mail className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Email Address</p>
            <p className="font-medium text-gray-900 dark:text-white">{user?.email || '-'}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Phone className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Phone Number</p>
            <p className="font-medium text-gray-900 dark:text-white">{user?.mobile_number || '-'}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Building2 className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Department</p>
            <p className="font-medium text-gray-900 dark:text-white">Property Management</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Shield className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">User ID</p>
            <p className="font-medium text-gray-900 dark:text-white">{user?.id || '-'}</p>
          </div>
        </div>
      </div>

      {/* Support and Logout */}
      <div className="flex justify-end">
        <button 
          onClick={handleLogout}
          className="flex items-center justify-center space-x-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg border border-red-100 dark:border-red-900/50 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors cursor-pointer"
        >
          <LogOut className="h-5 w-5" />
          <span>{t('logout')}</span>
        </button>
      </div>
    </div>
  );
}