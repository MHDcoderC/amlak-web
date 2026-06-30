import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import authManager from '../utils/auth';
import { getEntityId } from '../utils/entity';
import { AlertTriangle, Eye, MousePointerClick, FileText, LayoutDashboard, LogOut, X, XCircle, User, CheckCircle, Clock } from 'lucide-react';

const UserDashboard = ({ user, onLogout, onClose }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = useCallback(async () => {
    try {
      const token = authManager.getToken();
      const response = await axios.get(`${API_BASE_URL}/api/users/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setDashboardData(response.data);
    } catch (err) {
      console.error('Dashboard error:', err);
      if (err.response?.status === 401) {
        authManager.clearAuth();
        onLogout();
      } else {
        setError('خطا در دریافت اطلاعات داشبورد');
      }
    } finally {
      setLoading(false);
    }
  }, [onLogout]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleLogout = () => {
    authManager.clearAuth();
    onLogout();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30';
      case 'pending':
        return 'text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30';
      case 'rejected':
        return 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30';
      default:
        return 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700';
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
      <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-4xl shadow-2xl transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-slate-700">
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-warm-200 border-t-brand-600 mx-auto mb-3"></div>
            <p className="text-warm-500 text-sm">در حال بارگذاری...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-4xl shadow-2xl transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-slate-700">
          <div className="p-8 text-center">
            <div className="text-red-500 mb-4 flex justify-center"><AlertTriangle size={64} /></div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">خطا</h3>
            <p className="text-gray-600 dark:text-slate-300 mb-6">{error}</p>
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
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-4xl shadow-2xl transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-slate-700">
        {/* Header */}
        <div className="bg-slate-900 dark:bg-slate-950 text-white p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-brand-700 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">پنل کاربری</h2>
                <p className="text-slate-400 text-sm">خوش آمدید {user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleLogout}
                className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <LogOut size={16} />
                خروج
              </button>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white hover:bg-slate-800 p-2 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 text-center border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-center mb-2"><FileText className="w-5 h-5 text-brand-600" /></div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{dashboardData?.totalAds || 0}</div>
              <div className="text-gray-500 dark:text-slate-400 text-xs">کل آگهی‌ها</div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 text-center border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-center mb-2"><CheckCircle className="w-6 h-6 text-green-500" /></div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{dashboardData?.approvedAds || 0}</div>
              <div className="text-gray-500 dark:text-slate-400 text-xs">تایید شده</div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 text-center border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-center mb-2"><Clock className="w-6 h-6 text-amber-500" /></div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{dashboardData?.pendingAds || 0}</div>
              <div className="text-gray-500 dark:text-slate-400 text-xs">در انتظار</div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 text-center border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-center mb-2"><XCircle className="w-6 h-6 text-red-500" /></div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{dashboardData?.rejectedAds || 0}</div>
              <div className="text-gray-500 dark:text-slate-400 text-xs">رد شده</div>
            </div>
          </div>

          {/* Views and Clicks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 text-center border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-center mb-2"><Eye className="w-6 h-6 text-violet-500" /></div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{dashboardData?.totalViews || 0}</div>
              <div className="text-gray-500 dark:text-slate-400 text-xs">کل بازدیدها</div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 text-center border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-center mb-2"><MousePointerClick className="w-6 h-6 text-orange-500" /></div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{dashboardData?.totalClicks || 0}</div>
              <div className="text-gray-500 dark:text-slate-400 text-xs">کل کلیک‌ها</div>
            </div>
          </div>

          {/* Recent Ads */}
          <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-600" />
              آخرین آگهی‌های شما
            </h3>
            
            {dashboardData?.recentAds && dashboardData.recentAds.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.recentAds.map((ad) => (
                  <div key={getEntityId(ad)} className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-gray-200 dark:border-slate-700 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 dark:text-white mb-2">{ad.title}</h4>
                        <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-600 dark:text-slate-300">
                          <span>تاریخ: {formatDate(ad.createdAt)}</span>
                          <span className="flex items-center gap-1"><Eye size={14} /> {ad.viewCount} بازدید</span>
                          <span className="flex items-center gap-1"><MousePointerClick size={14} /> {ad.clickCount} کلیک</span>
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
                <div className="mb-4 flex justify-center text-slate-400"><FileText size={64} /></div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">هنوز آگهی‌ای ثبت نکرده‌اید</h4>
                <p className="text-gray-600 dark:text-slate-300">برای شروع، اولین آگهی خود را ثبت کنید</p>
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="mt-6 bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-200 dark:border-slate-700">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-slate-500" />
              اطلاعات حساب کاربری
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-500 dark:text-slate-400">نام:</span>
                <span className="font-medium text-gray-900 dark:text-white">{user.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 dark:text-slate-400">نام کاربری:</span>
                <span className="font-medium text-gray-900 dark:text-white">{user.username}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 dark:text-slate-400">شماره موبایل:</span>
                <span className="font-medium text-gray-900 dark:text-white">{user.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 dark:text-slate-400">نوع حساب:</span>
                <span className="font-medium text-gray-900 dark:text-white">
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
