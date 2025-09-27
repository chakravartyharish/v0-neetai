'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@neet/ui/button';

export default function AnalyticsPage() {
  const router = useRouter();
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(false);

  // Mock analytics data - in real app this would come from API
  const [analytics, setAnalytics] = useState({
    overview: {
      totalQuestions: 12456,
      totalUploads: 89,
      totalProcessed: 86,
      totalUsers: 1234,
      successRate: 96.6,
      avgProcessingTime: 4.2, // seconds
    },
    usage: {
      dailyUploads: [12, 18, 15, 22, 19, 25, 21], // Last 7 days
      dailyQuestions: [145, 189, 167, 203, 178, 234, 201],
      topSubjects: [
        { name: 'Physics', count: 4521, percentage: 36.3 },
        { name: 'Chemistry', count: 4012, percentage: 32.2 },
        { name: 'Biology', count: 3923, percentage: 31.5 },
      ],
      userActivity: [
        { time: '00:00', users: 45 },
        { time: '04:00', users: 23 },
        { time: '08:00', users: 234 },
        { time: '12:00', users: 456 },
        { time: '16:00', users: 378 },
        { time: '20:00', users: 289 },
      ],
    },
    performance: {
      ocrAccuracy: 94.2,
      avgResponseTime: 1.8, // seconds
      systemUptime: 99.8, // percentage
      errorRate: 0.4, // percentage
      storageUsed: 85.3, // percentage
      memoryUsage: 67.2, // percentage
      cpuUsage: 45.1, // percentage
    },
    errors: [
      { type: 'OCR Failed', count: 12, trend: 'down' },
      { type: 'File Too Large', count: 8, trend: 'stable' },
      { type: 'Invalid Format', count: 5, trend: 'down' },
      { type: 'Timeout', count: 3, trend: 'up' },
    ]
  });

  const handleGoBack = () => {
    router.push('/');
  };

  const refreshData = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      // In real app, fetch new data here
      setLoading(false);
    }, 1000);
  };

  const exportData = () => {
    // Simulate data export
    const data = JSON.stringify(analytics, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `neet-ai-analytics-${timeRange}.json`;
    link.click();
    URL.revokeObjectURL(url);
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
            <h1 className="text-2xl font-bold text-gray-900">Analytics & Performance</h1>
            <div className="flex space-x-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
              <Button variant="outline" onClick={exportData}>
                📊 Export Data
              </Button>
              <Button onClick={refreshData} disabled={loading}>
                {loading ? '🔄 Refreshing...' : '🔄 Refresh'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Analytics Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <span className="text-2xl">📄</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Questions</p>
                <p className="text-2xl font-semibold text-gray-900">{analytics.overview.totalQuestions.toLocaleString()}</p>
                <p className="text-xs text-green-600">↗️ +12% from last week</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <span className="text-2xl">📈</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-semibold text-gray-900">{analytics.overview.successRate}%</p>
                <p className="text-xs text-green-600">↗️ +0.8% from last week</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-semibold text-gray-900">{analytics.overview.totalUsers.toLocaleString()}</p>
                <p className="text-xs text-green-600">↗️ +5% from last week</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <span className="text-2xl">⚡</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Processing</p>
                <p className="text-2xl font-semibold text-gray-900">{analytics.overview.avgProcessingTime}s</p>
                <p className="text-xs text-red-600">↘️ -0.3s from last week</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Usage Statistics */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">📊 Daily Usage Trends</h2>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>PDF Uploads (Last 7 days)</span>
                  <span>Avg: 19/day</span>
                </div>
                <div className="flex items-end space-x-1 h-20">
                  {analytics.usage.dailyUploads.map((count, i) => (
                    <div
                      key={i}
                      className="bg-blue-500 rounded-t flex-1 min-h-[4px]"
                      style={{ height: `${(count / Math.max(...analytics.usage.dailyUploads)) * 100}%` }}
                      title={`Day ${i + 1}: ${count} uploads`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Questions Processed (Last 7 days)</span>
                  <span>Avg: 191/day</span>
                </div>
                <div className="flex items-end space-x-1 h-20">
                  {analytics.usage.dailyQuestions.map((count, i) => (
                    <div
                      key={i}
                      className="bg-green-500 rounded-t flex-1 min-h-[4px]"
                      style={{ height: `${(count / Math.max(...analytics.usage.dailyQuestions)) * 100}%` }}
                      title={`Day ${i + 1}: ${count} questions`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Subject Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">📚 Subject Distribution</h2>

            <div className="space-y-4">
              {analytics.usage.topSubjects.map((subject, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-900">{subject.name}</span>
                    <span className="text-gray-600">{subject.count.toLocaleString()} ({subject.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        i === 0 ? 'bg-blue-500' : i === 1 ? 'bg-green-500' : 'bg-purple-500'
                      }`}
                      style={{ width: `${subject.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">🎯 System Performance</h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">OCR Accuracy</span>
                <span className="text-lg font-semibold text-gray-900">{analytics.performance.ocrAccuracy}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${analytics.performance.ocrAccuracy}%` }} />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">System Uptime</span>
                <span className="text-lg font-semibold text-gray-900">{analytics.performance.systemUptime}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${analytics.performance.systemUptime}%` }} />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Response Time</span>
                <span className="text-lg font-semibold text-gray-900">{analytics.performance.avgResponseTime}s</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">💻 Resource Usage</h2>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Storage Used</span>
                  <span className="font-semibold">{analytics.performance.storageUsed}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-red-500 h-3 rounded-full" style={{ width: `${analytics.performance.storageUsed}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Memory Usage</span>
                  <span className="font-semibold">{analytics.performance.memoryUsage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-yellow-500 h-3 rounded-full" style={{ width: `${analytics.performance.memoryUsage}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">CPU Usage</span>
                  <span className="font-semibold">{analytics.performance.cpuUsage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-green-500 h-3 rounded-full" style={{ width: `${analytics.performance.cpuUsage}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">⚠️ Error Analysis</h2>

            <div className="space-y-3">
              {analytics.errors.map((error, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{error.type}</p>
                    <p className="text-xs text-gray-600">{error.count} occurrences</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      error.trend === 'up' ? 'bg-red-100 text-red-800' :
                      error.trend === 'down' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {error.trend === 'up' ? '↗️ Up' : error.trend === 'down' ? '↘️ Down' : '→ Stable'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Activity Heatmap */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">🕐 User Activity Timeline (24h)</h2>

          <div className="flex items-end justify-between space-x-2 h-32">
            {analytics.usage.userActivity.map((activity, i) => (
              <div key={i} className="flex flex-col items-center flex-1">
                <div
                  className="bg-blue-500 rounded-t w-full min-h-[8px]"
                  style={{ height: `${(activity.users / 500) * 100}%` }}
                  title={`${activity.time}: ${activity.users} users`}
                />
                <span className="text-xs text-gray-600 mt-2 transform -rotate-45 origin-left">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}