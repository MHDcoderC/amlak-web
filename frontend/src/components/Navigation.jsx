import { useState, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { Home, Shield, User, LogOut, Menu, X } from 'lucide-react';

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
    if (page === 'home') navigate('/');
    else if (page === 'admin') navigate('/admin');
  }, [onPageChange, navigate]);

  const closeMobile = useCallback(() => setIsMobileMenuOpen(false), []);

  return (
    <nav className="bg-white/90 dark:bg-warm-900/90 backdrop-blur-xl border-b border-warm-200 dark:border-warm-700 sticky top-0 z-50">
      <div className="page-shell">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <div
            className="flex items-center gap-2.5 cursor-pointer select-none"
            onClick={() => handlePageChange('home')}
          >
              <div className="w-8 h-8 bg-brand-700 rounded-lg flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block leading-tight">
              <h1 className="text-base font-black text-brand-700 dark:text-brand-400">
                املاک ایران
              </h1>
              <p className="text-[10px] text-warm-400 dark:text-warm-500 -mt-0.5">نسخه ۲</p>
            </div>
          </div>

          {/* Desktop */}
          <div className="hidden lg:flex items-center gap-1.5">
            {/* Calculator */}
            <button
              onClick={onCalculatorClick}
              className="p-2 text-warm-500 dark:text-warm-400 hover:text-warm-800 dark:hover:text-warm-200 hover:bg-warm-100 dark:hover:bg-warm-800 rounded-lg transition-colors duration-150"
              title="ماشین‌حساب وام"
            >
              <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </button>

            {/* Favorites */}
            <button
              onClick={onFavoritesClick}
              className="p-2 text-warm-500 dark:text-warm-400 hover:text-warm-800 dark:hover:text-warm-200 hover:bg-warm-100 dark:hover:bg-warm-800 rounded-lg transition-colors duration-150 relative"
              title="علاقه‌مندی‌ها"
            >
              <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {favoritesCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {favoritesCount > 9 ? '9+' : favoritesCount}
                </span>
              )}
            </button>

            {/* Theme */}
            <ThemeToggle />

            {/* Home */}
            <button
              onClick={() => handlePageChange('home')}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors duration-150 ${
                currentPage === 'home'
                  ? 'bg-brand-600 text-white'
                  : 'text-warm-600 dark:text-warm-400 hover:bg-warm-100 dark:hover:bg-warm-800'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Home className="w-4 h-4" />
                خانه
              </span>
            </button>

            {/* Auth */}
            {user ? (
              <div className="flex items-center gap-2 mr-1">
                <span className="text-xs text-warm-500 dark:text-warm-400">{user.name} سلام</span>
                {user.role === 'admin' ? (
                  <button
                    onClick={() => handlePageChange('admin')}
                    className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" />
                      مدیریت
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={onUserDashboardClick}
                    className="px-3 py-1.5 bg-brand-600 text-white rounded-lg text-xs font-semibold hover:bg-brand-700 transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      پنل من
                    </span>
                  </button>
                )}
                <button
                  onClick={onLogout}
                  className="p-2 text-warm-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="px-3 py-1.5 bg-brand-600 text-white rounded-lg text-xs font-semibold hover:bg-brand-700 transition-colors"
              >
                ورود / ثبت‌نام
              </button>
            )}
          </div>

          {/* Mobile */}
          <div className="lg:hidden flex items-center gap-1">
            <button
              onClick={onFavoritesClick}
              className="p-2 text-warm-500 hover:text-warm-800 dark:hover:text-warm-200 rounded-lg relative"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {favoritesCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {favoritesCount > 9 ? '9+' : favoritesCount}
                </span>
              )}
            </button>
            <button
              onClick={onCalculatorClick}
              className="p-2 text-warm-500 hover:text-warm-800 dark:hover:text-warm-200 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </button>
            <ThemeToggle />
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-warm-500 hover:text-warm-800 dark:hover:text-warm-200 rounded-lg"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-warm-900 border-t border-warm-200 dark:border-warm-700">
          <div className="px-4 py-3 space-y-1.5">
            <button
              onClick={() => { handlePageChange('home'); closeMobile(); }}
              className={`w-full text-right px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                currentPage === 'home'
                  ? 'bg-brand-600 text-white'
                  : 'text-warm-700 dark:text-warm-300 hover:bg-warm-100 dark:hover:bg-warm-800'
              }`}
            >
              <span className="flex items-center justify-end gap-2">
                <Home className="w-4 h-4" />
                خانه
              </span>
            </button>

            {user ? (
              <div className="space-y-1.5 pt-2 border-t border-warm-200 dark:border-warm-700">
                <div className="px-3 py-1.5 text-xs text-warm-500 dark:text-warm-400">
                  {user.name} سلام
                  {user.role === 'admin' && (
                    <span className="mr-1.5 px-1.5 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-[10px] rounded font-bold">مدیر</span>
                  )}
                </div>
                {user.role !== 'admin' && (
                  <button
                    onClick={() => { onUserDashboardClick(); closeMobile(); }}
                    className="w-full text-right px-3 py-2.5 rounded-lg text-sm font-semibold bg-brand-600 text-white"
                  >
                    <span className="flex items-center justify-end gap-2">
                      <User className="w-4 h-4" />
                      پنل کاربری
                    </span>
                  </button>
                )}
                {user.role === 'admin' && (
                  <button
                    onClick={() => { handlePageChange('admin'); closeMobile(); }}
                    className="w-full text-right px-3 py-2.5 rounded-lg text-sm font-semibold bg-red-600 text-white"
                  >
                    <span className="flex items-center justify-end gap-2">
                      <Shield className="w-4 h-4" />
                      پنل مدیریت
                    </span>
                  </button>
                )}
                <button
                  onClick={() => { onLogout(); closeMobile(); }}
                  className="w-full text-right px-3 py-2.5 rounded-lg text-sm font-semibold bg-red-500 text-white"
                >
                  <span className="flex items-center justify-end gap-2">
                    <LogOut className="w-4 h-4" />
                    خروج
                  </span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => { onLoginClick(); closeMobile(); }}
                className="w-full text-right px-3 py-2.5 rounded-lg text-sm font-semibold bg-brand-600 text-white"
              >
                ورود / ثبت‌نام
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
