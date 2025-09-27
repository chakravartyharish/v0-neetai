'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@neet/ui/button';
// Using HTML entities and emojis instead of lucide-react

export default function ProfilePage() {
  const router = useRouter();
  const [editing, setEditing] = useState(false);

  // Mock admin user data - in real app this would come from authentication/database
  const [adminData, setAdminData] = useState({
    name: 'Admin User',
    email: 'admin@neetai.dev',
    role: 'Administrator',
    joinedDate: '2024-01-15',
    lastLogin: '2024-09-16',
  });

  const handleGoBack = () => {
    router.push('/');
  };

  const handleSave = () => {
    // In real app, this would save to database
    setEditing(false);
    console.log('Profile updated:', adminData);
  };

  const handleCancel = () => {
    setEditing(false);
    // Reset changes if needed
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleGoBack}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <span className="mr-2">←</span>
                Back to Dashboard
              </button>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Profile</h1>
            <div className="w-32"></div> {/* Spacer for centered title */}
          </div>
        </div>
      </header>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl text-blue-600">👤</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{adminData.name}</h2>
                <p className="text-gray-600">{adminData.role}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              {editing ? (
                <>
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button onClick={() => setEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={adminData.name}
                      onChange={(e) => setAdminData({...adminData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
                      <span className="text-gray-500">👤</span>
                      <span>{adminData.name}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  {editing ? (
                    <input
                      type="email"
                      value={adminData.email}
                      onChange={(e) => setAdminData({...adminData, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
                      <span className="text-gray-500">✉️</span>
                      <span>{adminData.email}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
                    <span className="text-gray-500">🛡️</span>
                    <span>{adminData.role}</span>
                    <span className="ml-auto text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      System Admin
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Joined Date
                  </label>
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
                    <span className="text-gray-500">📅</span>
                    <span>{new Date(adminData.joinedDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Login
                  </label>
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
                    <span className="text-gray-500">🕐</span>
                    <span>{new Date(adminData.lastLogin).toLocaleDateString()}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Permissions
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded-md">
                      <span className="text-sm">Full System Access</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded-md">
                      <span className="text-sm">User Management</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded-md">
                      <span className="text-sm">Content Management</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full sm:w-auto">
                Change Password
              </Button>
              <Button variant="outline" className="w-full sm:w-auto ml-0 sm:ml-3">
                Two-Factor Authentication
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}