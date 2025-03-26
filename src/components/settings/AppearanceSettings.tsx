import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const themes = [
  {
    id: 'light',
    name: 'Light',
    icon: Sun,
    description: 'Clean and bright interface',
  },
  {
    id: 'dark',
    name: 'Dark',
    icon: Moon,
    description: 'Easy on the eyes',
  },
  {
    id: 'system',
    name: 'System',
    icon: Monitor,
    description: 'Follow system preferences',
  },
];

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Appearance Settings</h2>

      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium text-gray-700">Theme</label>
          <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {themes.map((theme) => (
              <div
                key={theme.id}
                className="relative flex cursor-pointer rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700 p-4 shadow-sm focus:outline-none"
                onClick={() => setTheme(theme.id as 'light' | 'dark' | 'system')}
              >
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-sm">
                      <div className="flex items-center gap-2">
                        <theme.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <p className="font-medium text-gray-900 dark:text-white">{theme.name}</p>
                      </div>
                      <p className="text-gray-500 dark:text-gray-400">{theme.description}</p>
                    </div>
                  </div>
                  <div className="ml-4 flex h-5 items-center">
                    <input
                      type="radio"
                      name="theme"
                      value={theme.id}
                      checked={theme === theme.id}
                      onChange={() => {}}
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Font Size</label>
          <select className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            <option>Small</option>
            <option>Medium</option>
            <option>Large</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Compact Mode</label>
          <div className="mt-2">
            <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-gray-200">
              <span className="translate-x-0 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Make the interface more compact by reducing spacing
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}