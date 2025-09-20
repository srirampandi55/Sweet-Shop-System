import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { Candy } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const { user: userData, token } = await authAPI.login(username, password);
      login(token, userData);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 ${
        isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-purple-50 to-yellow-50'
      }`}
    >
      <div
        className={`max-w-md w-full p-8 rounded-3xl shadow-xl ${
          isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        }`}
      >
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="absolute top-4 right-4 bg-gray-200 dark:bg-gray-700 p-2 rounded-full shadow-sm"
        >
          {isDark ? '☀️' : '🌙'}
        </button>

        {/* Logo & Title */}
        <div className="text-center">
          <div
            className={`mx-auto h-16 w-16 flex items-center justify-center rounded-full ${
              isDark ? 'bg-purple-700' : 'bg-purple-600'
            }`}
          >
            <Candy className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold">
            Sweet Shop Management
          </h2>
          <p className="mt-2 text-sm text-gray-400 dark:text-gray-300">
            Sign in to your account
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium">
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`mt-1 w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                  isDark
                    ? 'border-gray-600 focus:ring-purple-500 bg-gray-700 text-white placeholder-gray-400'
                    : 'border-gray-300 focus:ring-purple-500 bg-white text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`mt-1 w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                  isDark
                    ? 'border-gray-600 focus:ring-purple-500 bg-gray-700 text-white placeholder-gray-400'
                    : 'border-gray-300 focus:ring-purple-500 bg-white text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-4 text-center text-sm text-gray-400 dark:text-gray-300">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-medium text-purple-400 hover:text-purple-300"
          >
            Sign up
          </Link>
        </div>

        {/* Demo Accounts */}
        <div
          className={`mt-6 p-4 rounded-lg text-sm ${
            isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-600'
          }`}
        >
          <p className="font-medium mb-1">Demo Accounts:</p>
          <p>Admin: admin / admin123</p>
          <p>Staff: staff / staff123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
