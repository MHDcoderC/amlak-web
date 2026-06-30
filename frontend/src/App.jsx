import { useState, useEffect, useCallback, memo } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import AdminPanel from './pages/AdminPanel';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import ShowcaseNoticeModal from './components/ShowcaseNoticeModal';
import UnifiedAuthModal from './components/UnifiedAuthModal';
import UserDashboard from './components/UserDashboard';
import ErrorBoundary from './components/ErrorBoundary';
import ToastContainer from './components/Toast';
import { FavoritesModal, useFavorites } from './components/FavoritesManager';
import MortgageCalculator from './components/MortgageCalculator';
import authManager from './utils/auth';
import './index.css';

const AppContent = memo(() => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPage = location.pathname === '/' ? 'home' : location.pathname.slice(1);

  // User authentication states
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserDashboard, setShowUserDashboard] = useState(false);

  // New feature states
  const [showFavorites, setShowFavorites] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [searchFilters, setSearchFilters] = useState({});

  // Favorites hook
  const { favorites, toggleFavorite, isFavorite, removeFavorite } = useFavorites();

  // Check if user is already logged in on component mount
  useEffect(() => {
    if (authManager.isAuthenticated()) {
      const userData = authManager.getUser();
      setUser(userData);
    }
  }, []);

  const handlePageChange = useCallback((page) => {
    if (page === 'home') {
      navigate('/');
    } else if (page === 'admin' && authManager.isAdmin()) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleAuthSuccess = useCallback((userData) => {
    authManager.setToken(userData.token);
    authManager.setUser(userData.user);

    setUser(userData.user);
    setShowAuthModal(false);

    if (userData.user.role === 'admin') {
      const isFirstLogin = !sessionStorage.getItem('adminFirstLogin');
      if (isFirstLogin) {
        sessionStorage.setItem('adminFirstLogin', 'true');
        navigate('/admin');
      }
    } else {
      setShowUserDashboard(true);
      if (window.toast) {
        window.toast.success('خوش آمدید', `سلام ${userData.user.name} عزیز!`);
      }
    }
  }, [navigate]);

  const handleLogout = useCallback(() => {
    setUser(null);
    setShowUserDashboard(false);
    sessionStorage.removeItem('adminFirstLogin');
    authManager.logout();
    if (window.toast) {
      window.toast.info('خروج موفق', 'با موفقیت از حساب خود خارج شدید');
    }
  }, []);

  const handleLoginClick = useCallback(() => {
    setShowAuthModal(true);
  }, []);

  const handleUserDashboardClick = useCallback(() => {
    setShowUserDashboard(true);
  }, []);

  const handleCloseAuthModal = useCallback(() => {
    setShowAuthModal(false);
  }, []);

  const handleCloseUserDashboard = useCallback(() => {
    setShowUserDashboard(false);
  }, []);

  const handleSearch = useCallback((filters) => {
    setSearchFilters(filters);
    // Scroll to listings section
    const element = document.getElementById('listings-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleViewFavoriteAd = useCallback((ad) => {
    setShowFavorites(false);
    // Navigate to home and show the ad
    navigate('/');
    // Open the ad modal (this will be handled by the Home component)
    setTimeout(() => {
      const event = new CustomEvent('openAdModal', { detail: ad });
      window.dispatchEvent(event);
    }, 100);
  }, [navigate]);

  return (
    <div className="App min-h-screen bg-warm-50 dark:bg-warm-900 transition-colors duration-300">
      <ToastContainer />

      <Navigation
        currentPage={currentPage}
        onPageChange={handlePageChange}
        user={user}
        onLoginClick={handleLoginClick}
        onLogout={handleLogout}
        onUserDashboardClick={handleUserDashboardClick}
        onFavoritesClick={() => setShowFavorites(true)}
        favoritesCount={favorites.length}
        onCalculatorClick={() => setShowCalculator(true)}
      />

      {/* Showcase modal: one-time notice */}
      <ShowcaseNoticeModal />

      <main className="min-h-screen">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                user={user}
                onLoginRequired={handleLoginClick}
                searchFilters={searchFilters}
                onSearch={handleSearch}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                isFavorite={isFavorite}
              />
            }
          />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </main>

      {/* Unified Authentication Modal */}
      {showAuthModal && (
        <UnifiedAuthModal
          onClose={handleCloseAuthModal}
          onSuccess={handleAuthSuccess}
        />
      )}

      {/* User Dashboard */}
      {showUserDashboard && user && (
        <UserDashboard
          user={user}
          onLogout={handleLogout}
          onClose={handleCloseUserDashboard}
        />
      )}

      {/* Favorites Modal */}
      <FavoritesModal
        isOpen={showFavorites}
        onClose={() => setShowFavorites(false)}
        favorites={favorites}
        onRemove={removeFavorite}
        onViewAd={handleViewFavoriteAd}
      />

      {/* Mortgage Calculator Modal */}
      <MortgageCalculator
        isOpen={showCalculator}
        onClose={() => setShowCalculator(false)}
      />

      <Footer />
    </div>
  );
});

const App = memo(() => {
  return (
    <ErrorBoundary>
      <Router>
        <AppContent />
      </Router>
    </ErrorBoundary>
  );
});

App.displayName = 'App';

export default App;
