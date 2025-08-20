import { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';

const UserDashboard = ({ user, onLogout, onClose }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/users/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setDashboardData(response.data);
    } catch (err) {
      console.error('Dashboard error:', err);
      if (err.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        onLogout();
      } else {
        setError('خطا در دریافت اطلاعات داشبورد');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved':
        return 'تایید شده';
      case 'pending':
        return 'در انتظار تایید';
      case 'rejected':
        return 'رد شده';
      default:
        return 'نامشخص';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fa-IR');
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto">
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">در حال بارگذاری اطلاعات...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto">
          <div className="p-8 text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">خطا</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200"
            >
              بستن
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">پنل کاربری</h2>
              <p className="text-blue-100">خوش آمدید {user.name}</p>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <button
                onClick={handleLogout}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
              >
                خروج
              </button>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 text-2xl font-bold hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors duration-200"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center border border-blue-200">
              <div className="text-3xl font-bold text-blue-600 mb-2">{dashboardData?.totalAds || 0}</div>
              <div className="text-gray-600">کل آگهی‌ها</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center border border-green-200">
              <div className="text-3xl font-bold text-green-600 mb-2">{dashboardData?.approvedAds || 0}</div>
              <div className="text-gray-600">تایید شده</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 text-center border border-yellow-200">
              <div className="text-3xl font-bold text-yellow-600 mb-2">{dashboardData?.pendingAds || 0}</div>
              <div className="text-gray-600">در انتظار</div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 text-center border border-red-200">
              <div className="text-3xl font-bold text-red-600 mb-2">{dashboardData?.rejectedAds || 0}</div>
              <div className="text-gray-600">رد شده</div>
            </div>
          </div>

          {/* Views and Clicks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-center border border-purple-200">
              <div className="text-3xl font-bold text-purple-600 mb-2">{dashboardData?.totalViews || 0}</div>
              <div className="text-gray-600">کل بازدیدها</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 text-center border border-orange-200">
              <div className="text-3xl font-bold text-orange-600 mb-2">{dashboardData?.totalClicks || 0}</div>
              <div className="text-gray-600">کل کلیک‌ها</div>
            </div>
          </div>

          {/* Recent Ads */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-6">آخرین آگهی‌های شما</h3>
            
            {dashboardData?.recentAds && dashboardData.recentAds.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.recentAds.map((ad) => (
                  <div key={ad.id} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-2">{ad.title}</h4>
                        <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-600">
                          <span>تاریخ: {formatDate(ad.createdAt)}</span>
                          <span>👁 {ad.viewCount} بازدید</span>
                          <span>🖱️ {ad.clickCount} کلیک</span>
                        </div>
                      </div>
                      <div className="mr-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ad.status)}`}>
                          {getStatusText(ad.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">📝</div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">هنوز آگهی‌ای ثبت نکرده‌اید</h4>
                <p className="text-gray-600">برای شروع، اولین آگهی خود را ثبت کنید</p>
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">اطلاعات حساب کاربری</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600">نام:</span>
                <span className="font-semibold text-gray-800 mr-2">{user.name}</span>
              </div>
              <div>
                <span className="text-gray-600">نام کاربری:</span>
                <span className="font-semibold text-gray-800 mr-2">{user.username}</span>
              </div>
              <div>
                <span className="text-gray-600">شماره موبایل:</span>
                <span className="font-semibold text-gray-800 mr-2">{user.phone}</span>
              </div>
              <div>
                <span className="text-gray-600">نوع حساب:</span>
                <span className="font-semibold text-gray-800 mr-2">
                  {user.role === 'admin' ? 'مدیر' : 'کاربر عادی'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
