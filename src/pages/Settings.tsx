import React, { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { User, Palette, Languages } from 'lucide-react';
import { ProfileSettings } from '../components/settings/ProfileSettings';
import { AppearanceSettings } from '../components/settings/AppearanceSettings';
import { LanguageSettings } from '../components/settings/LanguageSettings';
import { useTranslation } from '../hooks/useTranslation';


export function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const { t } = useTranslation();

  const menuItems = [
    { id: 'profile', label: t('profile'), icon: User },
    { id: 'appearance', label: t('appearance'), icon: Palette },
    { id: 'language', label: t('language'), icon: Languages },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSettings />;
      case 'appearance':
        return <AppearanceSettings />;
      case 'language':
        return <LanguageSettings />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('accountSettings')}</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t('manageSettings')}
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className="w-full md:w-48 flex-shrink-0">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <nav className="space-y-1">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                        activeTab === item.id
                          ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 border-l-4 border-blue-700 dark:border-blue-500'
                          : 'text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <item.icon className={`mr-3 h-5 w-5 ${
                        activeTab === item.id ? 'text-blue-700' : 'text-gray-400'
                      }`} />
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}