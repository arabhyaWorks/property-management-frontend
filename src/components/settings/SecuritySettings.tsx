import React from 'react';
import { Shield, Key, Smartphone } from 'lucide-react';

export function SecuritySettings() {
  return (
    <div className="p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Security Settings</h2>

      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-start">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Key className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-sm font-medium text-gray-900">Password</h3>
              <p className="mt-1 text-sm text-gray-500">Last changed 3 months ago</p>
              <button className="mt-2 text-sm text-blue-600 hover:text-blue-700">
                Change Password
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-start">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Smartphone className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
                  <p className="mt-1 text-sm text-gray-500">Add an extra layer of security</p>
                </div>
                <div className="flex items-center">
                  <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-gray-200">
                    <span className="translate-x-0 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-start">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">Security Log</h3>
              <p className="mt-1 text-sm text-gray-500">View recent security activity</p>
              <button className="mt-2 text-sm text-blue-600 hover:text-blue-700">
                View Activity Log
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}