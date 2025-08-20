import { useEffect, useState, useCallback, useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import AdminAdModal from '../components/AdminAdModal';
import authManager from '../utils/auth';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement,
  PointElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement,
  PointElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend
);

const AdminPanel = memo(() => {
  const navigate = useNavigate();
  const [ads, setAds] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedAd, setSelectedAd] = useState(null);
  const [showAdModal, setShowAdModal] = useState(false);
  const [activeTab, setActiveTab] = useState('ads');

  const fetchData = useCallback(async () => {
    try {
      const token = authManager.getToken();
      const user = authManager.getUser();
      
      // Check if user is admin
      if (!token || !user || user.role !== 'admin') {
        console.error('Access denied: Admin only');
        navigate('/');
        return;
      }
      
      const [adsRes, statsRes, usersRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/ads/admin`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_BASE_URL}/api/ads/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_BASE_URL}/api/users/admin`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      setAds(adsRes.data.ads || adsRes.data);
      setStats(statsRes.data);
      setUsers(usersRes.data.users || usersRes.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleApprove = useCallback(async (id) => {
    try {
      const token = authManager.getToken();
      await axios.patch(`${API_BASE_URL}/api/ads/${id}/status`, {
        status: 'approved'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  }, [fetchData]);

  const handleReject = useCallback(async (id) => {
    try {
      const token = authManager.getToken();
      await axios.patch(`${API_BASE_URL}/api/ads/${id}/status`, {
        status: 'rejected'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  }, [fetchData]);

  const handleDelete = useCallback(async (id) => {
    if (window.confirm('آیا مطمئن هستید که می‌خواهید این آگهی را حذف کنید؟')) {
      try {
        const token = authManager.getToken();
        await axios.delete(`${API_BASE_URL}/api/ads/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  }, [fetchData]);

  const handleBanUser = useCallback(async (userId) => {
    if (window.confirm('آیا مطمئن هستید که می‌خواهید این کاربر را مسدود کنید؟')) {
      try {
        const token = authManager.getToken();
        await axios.post(`${API_BASE_URL}/api/users/${userId}/ban`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  }, [fetchData]);

  const handleUnbanUser = useCallback(async (userId) => {
    try {
      const token = authManager.getToken();
      await axios.post(`${API_BASE_URL}/api/users/${userId}/unban`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  }, [fetchData]);

  const handleDeleteUser = useCallback(async (userId) => {
    if (window.confirm('آیا مطمئن هستید که می‌خواهید این کاربر را حذف کنید؟ این عمل غیرقابل بازگشت است.')) {
      try {
        const token = authManager.getToken();
        await axios.delete(`${API_BASE_URL}/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  }, [fetchData]);

  const handleRateAd = useCallback(async (adId, stars) => {
    try {
      const token = authManager.getToken();
      await axios.post(`${API_BASE_URL}/api/ads/${adId}/rate`, { stars }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData(); // Refresh data
    } catch (err) {
      console.error(err);
    }
  }, [fetchData]);

  const handleLogout = useCallback(() => {
    authManager.logout();
  }, []);

  const handleViewAd = useCallback((ad) => {
    setSelectedAd(ad);
    setShowAdModal(true);
  }, []);

  const filteredAds = useMemo(() => {
    const adsArray = Array.isArray(ads) ? ads : [];
    return selectedStatus === 'all' 
      ? adsArray 
      : adsArray.filter(ad => ad.status === selectedStatus);
  }, [ads, selectedStatus]);

  const topViewedAds = useMemo(() => {
    const adsArray = Array.isArray(ads) ? ads : [];
    return adsArray
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, 5);
  }, [ads]);

  const topClickedAds = useMemo(() => {
    const adsArray = Array.isArray(ads) ? ads : [];
    return adsArray
      .sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0))
      .slice(0, 5);
  }, [ads]);

  const statusChartData = useMemo(() => ({
    labels: ['تایید شده', 'در انتظار', 'رد شده'],
    datasets: [{
      data: [stats.approvedAds || 0, stats.pendingAds || 0, stats.rejectedAds || 0],
      backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
      borderWidth: 0,
    }]
  }), [stats]);

  const viewsChartData = useMemo(() => {
    const adsArray = Array.isArray(ads) ? ads : [];
    return {
      labels: adsArray.slice(0, 10).map(ad => ad.title.substring(0, 20) + '...'),
      datasets: [{
        label: 'تعداد بازدید',
        data: adsArray.slice(0, 10).map(ad => ad.viewCount),
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        tension: 0.4,
      }]
    };
  }, [ads]);

  const clicksChartData = useMemo(() => {
    const adsArray = Array.isArray(ads) ? ads : [];
    return {
      labels: adsArray.slice(0, 10).map(ad => ad.title.substring(0, 20) + '...'),
      datasets: [{
        label: 'تعداد کلیک',
        data: adsArray.slice(0, 10).map(ad => ad.clickCount),
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
        tension: 0.4,
      }]
    };
  }, [ads]);

  // Check if user is admin
  const user = authManager.getUser();
  if (!user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">دسترسی غیرمجاز</h2>
          <p className="text-gray-600 mb-4">فقط مدیران می‌توانند به این صفحه دسترسی داشته باشند</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors"
          >
            بازگشت به صفحه اصلی
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8 border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🏢 پنل مدیریت املاک
              </h1>
              <p className="text-gray-600 text-lg">مدیریت آگهی‌ها و آمار سایت</p>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <span className="text-sm text-gray-600">مدیر: {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-md"
              >
                خروج
              </button>
            </div>
          </div>
        </div>

        {/* آمار کلی */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">کل آگهی‌ها</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalAds || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-4 rounded-xl bg-gradient-to-r from-green-500 to-green-600">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">کل بازدید</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalViews || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.122 2.122" />
                </svg>
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">کل کلیک</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalClicks || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-4 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">در انتظار تایید</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pendingAds || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* چارت‌های تعاملی */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="ml-2">📊</span>
              وضعیت آگهی‌ها
            </h3>
            <div className="h-80">
              <Doughnut 
                data={statusChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                          family: 'Vazirmatn',
                          size: 14
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="ml-2">📈</span>
              بازدید آگهی‌ها
            </h3>
            <div className="h-80">
              <Line 
                data={viewsChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: 'rgba(0,0,0,0.1)'
                      }
                    },
                    x: {
                      grid: {
                        color: 'rgba(0,0,0,0.1)'
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8 border border-gray-200">
          <div className="flex space-x-4 space-x-reverse mb-6">
            <button
              onClick={() => setActiveTab('ads')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'ads'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📋 مدیریت آگهی‌ها
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'users'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              👥 مدیریت کاربران
            </button>
          </div>

          {activeTab === 'ads' && (
            <div>
              {/* Filter */}
              <div className="mb-6">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">همه آگهی‌ها</option>
                  <option value="pending">در انتظار تایید</option>
                  <option value="approved">تایید شده</option>
                  <option value="rejected">رد شده</option>
                </select>
              </div>

              {/* Ads Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">عنوان</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">وضعیت</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">امتیاز</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">بازدید</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">کلیک</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAds.map(ad => (
                      <tr key={ad.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div>
                            <div className="font-medium text-gray-900">{ad.title}</div>
                            <div className="text-sm text-gray-500">{ad.province} - {ad.city}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            ad.status === 'approved' ? 'bg-green-100 text-green-800' :
                            ad.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {ad.status === 'approved' ? 'تایید شده' :
                             ad.status === 'pending' ? 'در انتظار' : 'رد شده'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-1 space-x-reverse">
                            <span className="text-sm text-gray-900">{ad.stars || 0}/5</span>
                            <div className="flex space-x-0.5 space-x-reverse">
                              {[1, 2, 3, 4, 5].map(star => (
                                <button
                                  key={star}
                                  onClick={() => handleRateAd(ad.id, star)}
                                  className={`text-lg ${star <= (ad.stars || 0) ? 'text-yellow-500' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
                                >
                                  ★
                                </button>
                              ))}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{ad.viewCount || 0}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{ad.clickCount || 0}</td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2 space-x-reverse">
                            <button
                              onClick={() => handleViewAd(ad)}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              مشاهده
                            </button>
                            {ad.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleApprove(ad.id)}
                                  className="text-green-600 hover:text-green-800 text-sm"
                                >
                                  تایید
                                </button>
                                <button
                                  onClick={() => handleReject(ad.id)}
                                  className="text-red-600 hover:text-red-800 text-sm"
                                >
                                  رد
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleDelete(ad.id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              حذف
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">نام</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">نام کاربری</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">شماره موبایل</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">وضعیت</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">تعداد آگهی</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">{user.name}</div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{user.username}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{user.phone}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user.isBanned ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {user.isBanned ? 'مسدود شده' : 'فعال'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{user.adsCount || 0}</td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2 space-x-reverse">
                            {user.isBanned ? (
                              <button
                                onClick={() => handleUnbanUser(user.id)}
                                className="text-green-600 hover:text-green-800 text-sm"
                              >
                                آزادسازی
                              </button>
                            ) : (
                              <button
                                onClick={() => handleBanUser(user.id)}
                                className="text-yellow-600 hover:text-yellow-800 text-sm"
                              >
                                مسدود کردن
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              حذف
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* مدال نمایش جزئیات آگهی */}
      {showAdModal && selectedAd && (
        <AdminAdModal 
          ad={selectedAd} 
          onClose={() => {
            setShowAdModal(false);
            setSelectedAd(null);
          }}
        />
      )}
    </div>
  );
});

export default AdminPanel;