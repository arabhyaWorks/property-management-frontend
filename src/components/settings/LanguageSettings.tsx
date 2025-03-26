import React from 'react';
import { Languages } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const languages = [
  {
    id: 'en',
    name: 'English',
    nativeName: 'English',
  },
  {
    id: 'hi',
    name: 'Hindi',
    nativeName: 'हिंदी',
  },
];

export function LanguageSettings() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="p-6">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Language Settings</h2>
      
      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Display Language</label>
          <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {languages.map((lang) => (
              <div
                key={lang.id}
                className="relative flex cursor-pointer rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700 p-4 shadow-sm focus:outline-none"
                onClick={() => setLanguage(lang.id as 'en' | 'hi')}
              >
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-sm">
                      <div className="flex items-center gap-2">
                        <Languages className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <p className="font-medium text-gray-900 dark:text-white">{lang.name}</p>
                      </div>
                      <p className="text-gray-500 dark:text-gray-400">{lang.nativeName}</p>
                    </div>
                  </div>
                  <div className="ml-4 flex h-5 items-center">
                    <input
                      type="radio"
                      name="language"
                      value={lang.id}
                      checked={language === lang.id}
                      onChange={() => {}}
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}