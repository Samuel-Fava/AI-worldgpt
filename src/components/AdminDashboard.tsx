import React, { useState, useEffect } from 'react';
import {
  Users,
  MessageSquare,
  BarChart3,
  TrendingUp,
  Shield,
  LogOut,
  Crown,
  UserCheck,
  Calendar,
  Activity
} from 'lucide-react';
import { aipRoute } from '../../utils/apis';

interface AdminStats {
  totalUsers: number;
  totalConversations: number;
  totalMessages: number;
  modelStats: Record<string, number>;
  dailyStats: Array<{ date: string; count: number }>;
  usageSplit: { connected: number; anonymous: number };
  topUsers: Array<any>;
  topSessions: Array<any>;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  plan: 'free' | 'premium';
  createdAt: string;
}

interface AdminDashboardProps {
  onSignOut: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onSignOut }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users'>('dashboard');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await aipRoute().get('/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error: any) {
      setError('Failed to fetch statistics');
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await aipRoute().get('/admin/users');
      console.log("Users response:", response.data);
      
      setUsers(response.data.users);
    } catch (error: any) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', error);
    }
  };

  const changePlan = async (userId: string, plan: 'free' | 'premium') => {
    try {
      const response = await aipRoute().post('/admin/change-plan',
        { userId, plan }
      );

      if (response.data.success) {
        setUsers(prev => prev.map(user =>
          user.id === userId ? { ...user, plan } : user
        ));
        alert(`User plan updated to ${plan} successfully`);
      }
    } catch (error: any) {
      alert('Failed to update user plan');
      console.error('Error changing plan:', error);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    onSignOut();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Shield size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">System administration panel</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="px-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === 'dashboard'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 size={18} />
                Dashboard
              </div>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === 'users'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              <div className="flex items-center gap-2">
                <Users size={18} />
                Users
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
          </div>
        )}

        {activeTab === 'dashboard' && stats && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Users size={24} className="text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Conversations</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalConversations}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <MessageSquare size={24} className="text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Messages</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalMessages}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Activity size={24} className="text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Connected Users</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.usageSplit.connected}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <TrendingUp size={24} className="text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Model Usage */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Usage Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(stats.modelStats).map(([model, count]) => (
                  <div key={model} className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                    <p className="text-sm text-gray-600 uppercase">{model}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Usage Split */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Type Distribution</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-3xl font-bold text-blue-600">{stats.usageSplit.connected}</p>
                  <p className="text-sm text-blue-700">Connected Users</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-3xl font-bold text-gray-600">{stats.usageSplit.anonymous}</p>
                  <p className="text-sm text-gray-700">Anonymous Users</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
              <p className="text-sm text-gray-600">Manage user accounts and subscription plans</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.length > 0 ? users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.plan === 'premium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                          }`}>
                          {user.plan === 'premium' && <Crown size={12} className="mr-1" />}
                          {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => changePlan(user.id, user.plan === 'free' ? 'premium' : 'free')}
                            className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium transition-colors ${user.plan === 'free'
                                ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                          >
                            {user.plan === 'free' ? (
                              <>
                                <Crown size={12} className="mr-1" />
                                Upgrade to Premium
                              </>
                            ) : (
                              <>
                                <UserCheck size={12} className="mr-1" />
                                Downgrade to Free
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="text-center py-4 text-sm text-gray-500">Loading</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};