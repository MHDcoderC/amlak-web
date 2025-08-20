import { useState, useCallback, memo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navigation = memo(({ currentPage, onPageChange, user, onLoginClick, onLogout, onUserDashboardClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const handlePageChange = useCallback((page) => {
    onPageChange(page);
  }, [onPageChange]);

  const handleMobilePageChange = useCallback((page) => {
    onPageChange(page);
    setIsMobileMenuOpen(false);
  }, [onPageChange]);

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

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                 <div className="flex justify-between items-center h-16">
                     {/* Logo */}
           <div className="flex items-center">
             <div className="flex-shrink-0">
               <div className="flex items-center space-x-2 space-x-reverse">
                 <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                   <span className="text-sm">🏠</span>
                 </div>
                 <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                   املاک ایران
                 </h1>
               </div>
             </div>
           </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
                         <div className="ml-10 flex items-baseline space-x-8 space-x-reverse">
                               <button
                  onClick={() => handlePageChange('home')}
                  className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 transform hover:scale-105 relative overflow-hidden group ${
                    currentPage === 'home'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                      : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 shadow-sm hover:shadow-md border border-gray-200/50'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <span className="flex items-center space-x-2 space-x-reverse relative z-10">
                    <span className="text-base">🏠</span>
                    <span>صفحه اصلی</span>
                  </span>
                </button>
              
              {/* User Authentication */}
              {user ? (
                <div className="flex items-center space-x-4 space-x-reverse">
                  <span className="text-sm text-gray-600">خوش آمدید {user.name}</span>
                                     {user.role === 'admin' ? (
                     <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">مدیر</span>
                   ) : (
                                          <button
                        onClick={onUserDashboardClick}
                        className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-3 py-1.5 rounded-lg font-medium text-xs hover:from-green-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-md hover:shadow-green-500/30"
                      >
                        <span className="flex items-center space-x-1 space-x-reverse">
                          <span className="text-sm">👤</span>
                          <span>پنل کاربری</span>
                        </span>
                      </button>
                   )}
                                      <button
                      onClick={onLogout}
                      className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-1.5 rounded-lg font-medium text-xs hover:from-red-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 hover:shadow-md hover:shadow-red-500/30"
                    >
                      <span className="flex items-center space-x-1 space-x-reverse">
                        <span className="text-sm">🚪</span>
                        <span>خروج</span>
                      </span>
                    </button>
                </div>
              ) : (
                                 <button
                   onClick={onLoginClick}
                   className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30 relative overflow-hidden group border border-white/20"
                 >
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                   <span className="flex items-center space-x-2 space-x-reverse relative z-10">
                     <span className="text-base">✨</span>
                     <span>ورود / ثبت‌نام</span>
                     <span className="text-sm">🔐</span>
                   </span>
                 </button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900 transition-colors duration-200"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-custom">
                     <div className="px-2 pt-2 pb-3 space-y-1">
                                          <button
                 onClick={() => handleMobilePageChange('home')}
                 className={`block w-full text-right px-3 py-2 rounded-xl font-medium text-sm transition-all duration-300 transform hover:scale-105 ${
                   currentPage === 'home'
                     ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                     : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 shadow-sm hover:shadow-md border border-gray-200/50'
                 }`}
               >
                 <span className="flex items-center justify-end space-x-2 space-x-reverse">
                   <span className="text-base">🏠</span>
                   <span>صفحه اصلی</span>
                 </span>
               </button>
            
                         {/* Mobile User Authentication */}
             {user ? (
               <>
                 <div className="px-3 py-2 text-sm text-gray-600">
                   خوش آمدید {user.name}
                   {user.role === 'admin' && (
                     <span className="mr-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">مدیر</span>
                   )}
                 </div>
                                   {user.role !== 'admin' && (
                                        <button
                       onClick={handleMobileUserDashboardClick}
                       className="block w-full text-right px-3 py-2 rounded-xl font-medium text-sm transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-green-500 to-blue-600 text-white hover:from-green-600 hover:to-blue-700 hover:shadow-lg hover:shadow-green-500/30"
                     >
                       <span className="flex items-center justify-end space-x-2 space-x-reverse">
                         <span className="text-sm">👤</span>
                         <span>پنل کاربری</span>
                       </span>
                     </button>
                  )}
                                    <button
                     onClick={handleMobileLogout}
                     className="block w-full text-right px-3 py-2 rounded-xl font-medium text-sm transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 hover:shadow-lg hover:shadow-red-500/30"
                   >
                     <span className="flex items-center justify-end space-x-2 space-x-reverse">
                       <span className="text-sm">🚪</span>
                       <span>خروج</span>
                     </span>
                   </button>
               </>
             ) : (
                                                               <button
                   onClick={handleMobileLoginClick}
                   className="block w-full text-right px-3 py-2 rounded-xl font-medium text-sm transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/30 relative overflow-hidden group"
                 >
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                   <span className="flex items-center justify-end space-x-2 space-x-reverse relative z-10">
                     <span className="text-base">✨</span>
                     <span>ورود / ثبت‌نام</span>
                     <span className="text-sm">🔐</span>
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