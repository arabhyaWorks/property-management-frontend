import React from 'react';
import { Mail, MessageSquare, Bell } from 'lucide-react';

const notificationTypes = [
  {
    id: 'email',
    title: 'Email Notifications',
    icon: Mail,
    description: 'Receive email notifications for important updates',
    options: [
      { id: 'payments', label: 'Payment Reminders' },
      { id: 'updates', label: 'System Updates' },
      { id: 'news', label: 'News and Announcements' },
    ],
  },
  {
    id: 'sms',
    title: 'SMS Notifications',
    icon: MessageSquare,
    description: 'Get SMS alerts for critical activities',
    options: [
      { id: 'security', label: 'Security Alerts' },
      { id: 'payments', label: 'Payment Due Dates' },
      { id: 'status', label: 'Application Status' },
    ],
  },
  {
    id: 'push',
    title: 'Push Notifications',
    icon: Bell,
    description: 'Receive in-app notifications',
    options: [
      { id: 'mentions', label: 'Mentions & Replies' },
      { id: 'reminders', label: 'Task Reminders' },
      { id: 'updates', label: 'System Updates' },
    ],
  },
];

export function NotificationSettings() {
  return (
    <div className="p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Notification Preferences</h2>

      <div className="space-y-6">
        {notificationTypes.map((type) => (
          <div key={type.id} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start">
              <div className="p-2 bg-blue-100 rounded-lg">
                <type.icon className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-sm font-medium text-gray-900">{type.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{type.description}</p>
                
                <div className="mt-4 space-y-4">
                  {type.options.map((option) => (
                    <div key={option.id} className="flex items-center">
                      <input
                        id={`${type.id}-${option.id}`}
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`${type.id}-${option.id}`}
                        className="ml-3 text-sm text-gray-700"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
}