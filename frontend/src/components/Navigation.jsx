import { useState, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { Home, Shield, User, LogOut, Sparkles, Lock, Menu, X } from 'lucide-react';

const Navigation = memo(({
  currentPage,
  onPageChange,
  user,
  onLoginClick,
  onLogout,
  onUserDashboardClick,
  onFavoritesClick,
  favoritesCount = 0,
  onCalculatorClick
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const handlePageChange = useCallback((page) => {
    onPageChange(page);
    if (page === 'home') {
      navigate('/');
    } else if (page === 'admin') {
      navigate('/admin');
    }
  }, [onPageChange, navigate]);

  const handleMobilePageChange = useCallback((page) => {
    handlePageChange(page);
    setIsMobileMenuOpen(false);
  }, [handlePageChange]);

  const handleMobileLoginClick = useCallback(() => {
    onLoginClick();
    setIsMobileMenuOpen(false);
  }, [onLoginClick]);

  const handleMobileLogout = useCallback(() => {
    onLogout();
    setIsMobileMenuOpen(false);
  }, [onLogout]);

  const handleMobileUserDashboardClick = useCallback(() => {
    onUserDashboardClick();
    setIsMobileMenuOpen(false);
  }, [onUserDashboardClick]);

  const handleMobileFavoritesClick = useCallback(() => {
    onFavoritesClick();
    setIsMobileMenuOpen(false);
  }, [onFavoritesClick]);

  const handleMobileCalculatorClick = useCallback(() => {
    onCalculatorClick();
    setIsMobileMenuOpen(false);
  }, [onCalculatorClick]);

  return (
    <nav className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 cursor-pointer" onClick={() => handlePageChange('home')}>
              <div className="flex items-center space-x-2 space-x-reverse">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-blue-700 dark:text-blue-400">
                    املاک ایران
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">ورژن ۲</p>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Calculator Button */}
            <button
              onClick={onCalculatorClick}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-all duration-200 group relative"
              title="ماشین‌حساب وام"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                ماشین‌حساب وام
              </span>
            </button>

            {/* Favorites Button */}
            <button
              onClick={onFavoritesClick}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-all duration-200 group relative"
              title="علاقه‌مندی‌ها"
            >
              <div className="relative">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {favoritesCount > 9 ? '9+' : favoritesCount}
                  </span>
                )}
              </div>
              <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                علاقه‌مندی‌ها
              </span>
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Home Button */}
            <button
              onClick={() => handlePageChange('home')}
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 transform hover:scale-105 relative overflow-hidden group ${
                currentPage === 'home'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-slate-600'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="flex items-center space-x-2 space-x-reverse relative z-10">
                <Home className="w-4 h-4" />
                <span>صفحه اصلی</span>
              </span>
            </button>

            {/* User Authentication */}
            {user ? (
              <div className="flex items-center space-x-4 space-x-reverse mr-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">سلام، {user.name}</span>
                {user.role === 'admin' ? (
                  <button
                    onClick={() => handlePageChange('admin')}
                    className="px-4 py-2 bg-red-600 text-white rounded-xl font-medium text-sm hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <span className="flex items-center space-x-2 space-x-reverse">
                      <Shield className="w-4 h-4" />
                      <span>پنل مدیریت</span>
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={onUserDashboardClick}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium text-sm hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <span className="flex items-center space-x-2 space-x-reverse">
                      <User className="w-4 h-4" />
                      <span>پنل کاربری</span>
                    </span>
                  </button>
                )}
                <button
                  onClick={onLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl font-medium text-sm hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <span className="flex items-center space-x-2 space-x-reverse">
                    <LogOut className="w-4 h-4" />
                    <span>خروج</span>
                  </span>
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium text-sm hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg relative overflow-hidden group border border-white/20"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="flex items-center space-x-2 space-x-reverse relative z-10">
                  <Sparkles className="w-4 h-4" />
                  <span>ورود / ثبت‌نام</span>
                  <Lock className="w-4 h-4" />
                </span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-2">
            {/* Mobile Favorites */}
            <button
              onClick={handleMobileFavoritesClick}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl relative"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {favoritesCount > 9 ? '9+' : favoritesCount}
                </span>
              )}
            </button>

            {/* Mobile Calculator */}
            <button
              onClick={handleMobileCalculatorClick}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Hamburger Menu */}
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-all duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="px-4 py-3 space-y-2">
            <button
              onClick={() => handleMobilePageChange('home')}
              className={`w-full text-right px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                currentPage === 'home'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-slate-600'
              }`}
            >
              <span className="flex items-center justify-end space-x-3 space-x-reverse">
                <Home className="w-5 h-5" />
                <span>صفحه اصلی</span>
              </span>
            </button>

            {/* Mobile User Authentication */}
            {user ? (
              <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                  خوش آمدید، {user.name}
                  {user.role === 'admin' && (
                    <span className="mr-2 px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 text-xs rounded-full">مدیر</span>
                  )}
                </div>
                {user.role !== 'admin' && (
                  <button
                    onClick={handleMobileUserDashboardClick}
                    className="w-full text-right px-4 py-3 rounded-xl font-medium text-sm bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-300"
                  >
                    <span className="flex items-center justify-end space-x-3 space-x-reverse">
                      <User className="w-5 h-5" />
                      <span>پنل کاربری</span>
                    </span>
                  </button>
                )}
                {user.role === 'admin' && (
                  <button
                    onClick={() => {
                      handleMobilePageChange('admin');
                    }}
                    className="w-full text-right px-4 py-3 rounded-xl font-medium text-sm bg-red-600 text-white hover:bg-red-700 transition-all duration-300"
                  >
                    <span className="flex items-center justify-end space-x-3 space-x-reverse">
                      <Shield className="w-5 h-5" />
                      <span>پنل مدیریت</span>
                    </span>
                  </button>
                )}
                <button
                  onClick={handleMobileLogout}
                  className="w-full text-right px-4 py-3 rounded-xl font-medium text-sm bg-red-600 text-white hover:bg-red-700 transition-all duration-300"
                >
                  <span className="flex items-center justify-end space-x-3 space-x-reverse">
                    <LogOut className="w-5 h-5" />
                    <span>خروج</span>
                  </span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleMobileLoginClick}
                className="w-full text-right px-4 py-3 rounded-xl font-medium text-sm bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300"
              >
                <span className="flex items-center justify-end space-x-3 space-x-reverse">
                  <Sparkles className="w-5 h-5" />
                  <span>ورود / ثبت‌نام</span>
                  <Lock className="w-4 h-4" />
                </span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
});

Navigation.displayName = 'Navigation';

export default Navigation;
