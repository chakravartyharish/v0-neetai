'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@neet/ui/button';

export default function SettingsPage() {
  const router = useRouter();

  const [settings, setSettings] = useState({
    // OCR Settings
    ocr: {
      provider: 'tesseract',
      language: 'english',
      accuracy: 'high',
      processingMode: 'batch',
      autoProcess: true,
      confidenceThreshold: 85,
    },
    // System Settings
    system: {
      maxFileSize: 50, // MB
      allowedFormats: ['pdf', 'jpg', 'png', 'tiff'],
      sessionTimeout: 60, // minutes
      enableLogging: true,
      logLevel: 'info',
      autoBackup: true,
      backupFrequency: 'daily',
    },
    // Email Settings
    email: {
      smtpServer: 'smtp.gmail.com',
      smtpPort: 587,
      enableTLS: true,
      senderEmail: 'admin@neetai.dev',
      enableNotifications: true,
    }
  });

  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('ocr');

  const handleGoBack = () => {
    router.push('/');
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // In real app, this would save to backend/database
      console.log('Saving settings:', settings);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleResetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      // Reset to default values
      setSettings({
        ocr: {
          provider: 'tesseract',
          language: 'english',
          accuracy: 'high',
          processingMode: 'batch',
          autoProcess: true,
          confidenceThreshold: 85,
        },
        system: {
          maxFileSize: 50,
          allowedFormats: ['pdf', 'jpg', 'png', 'tiff'],
          sessionTimeout: 60,
          enableLogging: true,
          logLevel: 'info',
          autoBackup: true,
          backupFrequency: 'daily',
        },
        email: {
          smtpServer: 'smtp.gmail.com',
          smtpPort: 587,
          enableTLS: true,
          senderEmail: 'admin@neetai.dev',
          enableNotifications: true,
        }
      });
    }
  };

  const updateSetting = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }));
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
            <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleResetSettings}>
                Reset to Defaults
              </Button>
              <Button onClick={handleSaveSettings} disabled={saving}>
                {saving ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Settings Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'ocr', name: 'OCR Settings', icon: '🔍' },
                { id: 'system', name: 'System Settings', icon: '⚙️' },
                { id: 'email', name: 'Email Settings', icon: '✉️' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* OCR Settings Tab */}
          {activeTab === 'ocr' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">OCR Configuration</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    OCR Provider
                  </label>
                  <select
                    value={settings.ocr.provider}
                    onChange={(e) => updateSetting('ocr', 'provider', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="tesseract">Tesseract OCR</option>
                    <option value="google">Google Vision API</option>
                    <option value="aws">AWS Textract</option>
                    <option value="azure">Azure Computer Vision</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={settings.ocr.language}
                    onChange={(e) => updateSetting('ocr', 'language', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="english">English</option>
                    <option value="hindi">Hindi</option>
                    <option value="multi">Multi-language</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Processing Accuracy
                  </label>
                  <select
                    value={settings.ocr.accuracy}
                    onChange={(e) => updateSetting('ocr', 'accuracy', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="fast">Fast (Lower accuracy)</option>
                    <option value="balanced">Balanced</option>
                    <option value="high">High (Slower processing)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Processing Mode
                  </label>
                  <select
                    value={settings.ocr.processingMode}
                    onChange={(e) => updateSetting('ocr', 'processingMode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="single">Single File</option>
                    <option value="batch">Batch Processing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confidence Threshold (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={settings.ocr.confidenceThreshold}
                    onChange={(e) => updateSetting('ocr', 'confidenceThreshold', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="autoProcess"
                    checked={settings.ocr.autoProcess}
                    onChange={(e) => updateSetting('ocr', 'autoProcess', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="autoProcess" className="ml-2 block text-sm text-gray-900">
                    Auto-process uploaded files
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* System Settings Tab */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">System Configuration</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum File Size (MB)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={settings.system.maxFileSize}
                    onChange={(e) => updateSetting('system', 'maxFileSize', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="480"
                    value={settings.system.sessionTimeout}
                    onChange={(e) => updateSetting('system', 'sessionTimeout', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Log Level
                  </label>
                  <select
                    value={settings.system.logLevel}
                    onChange={(e) => updateSetting('system', 'logLevel', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="error">Error only</option>
                    <option value="warn">Warning</option>
                    <option value="info">Info</option>
                    <option value="debug">Debug</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Backup Frequency
                  </label>
                  <select
                    value={settings.system.backupFrequency}
                    onChange={(e) => updateSetting('system', 'backupFrequency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enableLogging"
                    checked={settings.system.enableLogging}
                    onChange={(e) => updateSetting('system', 'enableLogging', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="enableLogging" className="ml-2 block text-sm text-gray-900">
                    Enable system logging
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="autoBackup"
                    checked={settings.system.autoBackup}
                    onChange={(e) => updateSetting('system', 'autoBackup', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="autoBackup" className="ml-2 block text-sm text-gray-900">
                    Enable automatic backups
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Email Settings Tab */}
          {activeTab === 'email' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Email Configuration</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Server
                  </label>
                  <input
                    type="text"
                    value={settings.email.smtpServer}
                    onChange={(e) => updateSetting('email', 'smtpServer', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="smtp.gmail.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Port
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="65535"
                    value={settings.email.smtpPort}
                    onChange={(e) => updateSetting('email', 'smtpPort', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sender Email
                  </label>
                  <input
                    type="email"
                    value={settings.email.senderEmail}
                    onChange={(e) => updateSetting('email', 'senderEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="admin@neetai.dev"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enableTLS"
                    checked={settings.email.enableTLS}
                    onChange={(e) => updateSetting('email', 'enableTLS', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="enableTLS" className="ml-2 block text-sm text-gray-900">
                    Enable TLS encryption
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enableNotifications"
                    checked={settings.email.enableNotifications}
                    onChange={(e) => updateSetting('email', 'enableNotifications', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="enableNotifications" className="ml-2 block text-sm text-gray-900">
                    Enable email notifications
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}