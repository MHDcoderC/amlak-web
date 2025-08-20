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

  // Authentication handlers
  const handleAuthSuccess = useCallback((userData) => {
    // Store token and user data first
    authManager.setToken(userData.token);
    authManager.setUser(userData.user);
    
    // Update local state
    setUser(userData.user);
    setShowAuthModal(false);

    // Redirect based on user role only on first login
    if (userData.user.role === 'admin') {
      // Check if this is the first time admin is logging in
      const isFirstLogin = !sessionStorage.getItem('adminFirstLogin');
      if (isFirstLogin) {
        sessionStorage.setItem('adminFirstLogin', 'true');
        navigate('/admin');
      }
    } else {
      setShowUserDashboard(true);
    }
  }, [navigate]);

  const handleLogout = useCallback(() => {
    setUser(null);
    setShowUserDashboard(false);
    sessionStorage.removeItem('adminFirstLogin');
    authManager.logout();
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

  return (
    <div className="App min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <Navigation 
        currentPage={currentPage} 
        onPageChange={handlePageChange}
        user={user}
        onLoginClick={handleLoginClick}
        onLogout={handleLogout}
        onUserDashboardClick={handleUserDashboardClick}
      />

      {/* Showcase modal: one-time notice */}
      <ShowcaseNoticeModal />
      
      <main className="min-h-screen animate-in fade-in duration-500">
        <Routes>
          <Route path="/" element={<Home user={user} onLoginRequired={handleLoginClick} />} />
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