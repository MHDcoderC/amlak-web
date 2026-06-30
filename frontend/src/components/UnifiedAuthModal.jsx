import { useState, useCallback, useMemo, memo } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import authManager from '../utils/auth';

// SIMPLIFIED AUTH MODAL - REMOVED EMAIL AND CONFIRM PASSWORD
const UnifiedAuthModal = memo(({ onClose, onSuccess }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Login form state
  const [loginCredentials, setLoginCredentials] = useState({
    username: '',
    password: ''
  });

  // Registration form state - SIMPLIFIED
  const [registrationData, setRegistrationData] = useState({
    name: '',
    username: '',
    phone: '',
    password: ''
  });

  const handleLoginInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setLoginCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  }, [error]);

  const handleRegistrationInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setRegistrationData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  }, [error]);

  const handleLogin = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/users/login`, {
        username: loginCredentials.username.trim(),
        password: loginCredentials.password
      });

      // Store token and user data securely
      authManager.setToken(response.data.token);
      authManager.setUser(response.data.user);

      // Call success callback with user data
      onSuccess(response.data);
    } catch (err) {
      console.error('Login error:', err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('خطا در ورود. لطفاً دوباره تلاش کنید');
      }
    } finally {
      setLoading(false);
    }
  }, [loginCredentials, onSuccess]);

  const handleRegistration = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate password length
    if (registrationData.password.length < 6) {
      setError('رمز عبور باید حداقل 6 کاراکتر باشد');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/users/register`, {
        name: registrationData.name.trim(),
        username: registrationData.username.trim(),
        phone: registrationData.phone.trim(),
        password: registrationData.password
      });

      // Store token and user data securely
      authManager.setToken(response.data.token);
      authManager.setUser(response.data.user);

      // Call success callback with user data
      onSuccess(response.data);
    } catch (err) {
      console.error('Registration error:', err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('خطا در ثبت‌نام. لطفاً دوباره تلاش کنید');
      }
    } finally {
      setLoading(false);
    }
  }, [registrationData, onSuccess]);

  const toggleMode = useCallback(() => {
    setIsLoginMode(prev => !prev);
    setError('');
    setShowPassword(false);
  }, []);

  const isLoginFormValid = useMemo(() => {
    return loginCredentials.username.trim() && loginCredentials.password.trim();
  }, [loginCredentials]);

  const isRegistrationFormValid = useMemo(() => {
    return (
      registrationData.name.trim() &&
      registrationData.username.trim() &&
      registrationData.phone.trim() &&
      registrationData.password &&
      registrationData.password.length >= 6
    );
  }, [registrationData]);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl w-full max-w-sm shadow-2xl transform transition-all duration-500 scale-100 border border-white/20 dark:border-slate-700">
        {/* Header */}
        <div className="bg-brand-700 text-white p-6 rounded-t-3xl text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
          
          <button
            onClick={onClose}
            className="absolute top-3 left-3 text-white/80 hover:text-white text-xl font-bold p-1.5 hover:bg-white/20 rounded-lg transition-colors"
          >
            ×
          </button>
          
          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3 border border-white/30">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          
          <h2 className="text-xl font-bold mb-1 relative z-10">
            {isLoginMode ? 'ورود به حساب' : 'ثبت‌نام'}
          </h2>
          <p className="text-brand-100 text-xs relative z-10">
            {isLoginMode ? 'لطفاً وارد شوید' : 'حساب کاربری جدید ایجاد کنید'}
          </p>
        </div>

        {/* Form */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50/80 dark:bg-red-900/30 backdrop-blur-sm border border-red-200/50 dark:border-red-700 rounded-xl text-red-600 dark:text-red-300 text-sm shadow-lg">
              <div className="flex items-center space-x-2 space-x-reverse">
                <span className="text-lg">⚠️</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {isLoginMode ? (
            // Login Form
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-2">
                  نام کاربری یا شماره موبایل
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="username"
                    required
                    className="w-full pl-4 pr-12 py-2.5 border border-warm-200 dark:border-warm-600 rounded-lg focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-colors duration-150 bg-white dark:bg-warm-800 text-warm-900 dark:text-white placeholder:text-warm-400"
                    value={loginCredentials.username}
                    onChange={handleLoginInputChange}
                    placeholder="نام کاربری یا شماره موبایل"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-2">
                  رمز عبور
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    className="w-full pl-4 pr-12 py-2.5 border border-warm-200 dark:border-warm-600 rounded-lg focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-colors duration-150 bg-white dark:bg-warm-800 text-warm-900 dark:text-white placeholder:text-warm-400"
                    value={loginCredentials.password}
                    onChange={handleLoginInputChange}
                    placeholder="رمز عبور"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={!isLoginFormValid || loading}
                className="w-full bg-brand-700 text-white py-2.5 px-6 rounded-lg font-semibold hover:bg-brand-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    در حال ورود...
                  </div>
                ) : (
                  'ورود'
                )}
              </button>
            </form>
          ) : (
            // Registration Form - SIMPLIFIED
            <form onSubmit={handleRegistration} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-2">
                  نام کامل *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/80 dark:bg-slate-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-400 backdrop-blur-sm"
                  value={registrationData.name}
                  onChange={handleRegistrationInputChange}
                  placeholder="نام و نام خانوادگی"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-2">
                  شماره موبایل *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/80 dark:bg-slate-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-400 backdrop-blur-sm"
                  value={registrationData.phone}
                  onChange={handleRegistrationInputChange}
                  placeholder="09xxxxxxxxx"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-2">
                  نام کاربری *
                </label>
                <input
                  type="text"
                  name="username"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/80 dark:bg-slate-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-400 backdrop-blur-sm"
                  value={registrationData.username}
                  onChange={handleRegistrationInputChange}
                  placeholder="نام کاربری"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-2">
                  رمز عبور *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/80 dark:bg-slate-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-400 backdrop-blur-sm"
                    value={registrationData.password}
                    onChange={handleRegistrationInputChange}
                    placeholder="رمز عبور"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={!isRegistrationFormValid || loading}
                className="w-full bg-emerald-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-emerald-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    در حال ثبت نام...
                  </div>
                ) : (
                  'ثبت نام'
                )}
              </button>
            </form>
          )}

          {/* Toggle Mode */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={toggleMode}
              className="text-brand-700 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 text-sm font-medium transition-colors"
            >
              {isLoginMode ? 'حساب کاربری ندارید؟ ثبت‌نام کنید' : 'قبلاً ثبت نام کرده‌اید؟ ورود'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

UnifiedAuthModal.displayName = 'UnifiedAuthModal';

export default UnifiedAuthModal;
