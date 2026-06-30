import { useEffect, useState, useCallback, useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import { Line, Doughnut } from 'react-chartjs-2';
import AdminAdModal from '../components/AdminAdModal';
import authManager from '../utils/auth';
import { getEntityId } from '../utils/entity';
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
import { 
  Shield, 
  Eye, 
  MousePointerClick, 
  Clock, 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileText,
  Ban,
  Star,
  Building
} from 'lucide-react';

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
  }, [navigate]);

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
        await axios.patch(`${API_BASE_URL}/api/users/admin/${userId}`, {
          isBanned: true
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchData();
      } catch (err) {
        console.error('Error banning user:', err);
      }
    }
  }, [fetchData]);

  const handleUnbanUser = useCallback(async (userId) => {
    try {
      const token = authManager.getToken();
      await axios.patch(`${API_BASE_URL}/api/users/admin/${userId}`, {
        isBanned: false
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.error('Error unbanning user:', err);
    }
  }, [fetchData]);

  const handleDeleteUser = useCallback(async (userId) => {
    if (window.confirm('آیا مطمئن هستید که می‌خواهید این کاربر را حذف کنید؟ این عمل غیرقابل بازگشت است.')) {
      try {
        const token = authManager.getToken();
        await axios.delete(`${API_BASE_URL}/api/users/admin/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchData();
      } catch (err) {
        console.error('Error deleting user:', err);
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

  // Check if user is admin
  const user = authManager.getUser();
  if (!user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="text-center">
          <div className="text-red-500 mb-4"><Ban size={64} /></div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">دسترسی غیرمجاز</h2>
          <p className="text-gray-600 dark:text-slate-300 mb-4">فقط مدیران می‌توانند به این صفحه دسترسی داشته باشند</p>
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-slate-300 text-lg">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="page-shell py-6 sm:py-8">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-5 mb-6 border border-gray-200 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">پنل مدیریت</h1>
                <p className="text-gray-500 dark:text-slate-400 text-sm">مدیریت آگهی‌ها و کاربران</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 dark:text-slate-400">{user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
              >
                خروج
              </button>
            </div>
          </div>
        </div>

        {/* آمار کلی */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Building className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-slate-400">کل آگهی‌ها</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalAds || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Eye className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-slate-400">کل بازدید</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalViews || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                <MousePointerClick className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-slate-400">کل کلیک</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalClicks || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-slate-400">در انتظار تایید</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.pendingAds || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* چارت‌های تعاملی */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200 dark:border-slate-700">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
              <BarChart3 className="w-6 h-6 ml-2 text-blue-500" />
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

          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200 dark:border-slate-700">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
              <TrendingUp className="w-6 h-6 ml-2 text-green-500" />
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
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 sm:p-8 mb-8 border border-gray-200 dark:border-slate-700">
          <div className="flex space-x-4 space-x-reverse mb-6">
            <button
              onClick={() => setActiveTab('ads')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center ${
                activeTab === 'ads'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-700'
              }`}
            >
              <FileText className="w-5 h-5 ml-2" />
              مدیریت آگهی‌ها
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center ${
                activeTab === 'users'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-700'
              }`}
            >
              <Users className="w-5 h-5 inline ml-2" />
              مدیریت کاربران
            </button>
          </div>

          {activeTab === 'ads' && (
            <div>
              {/* Filter */}
              <div className="mb-6">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    <tr className="bg-gray-50 dark:bg-slate-800">
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-slate-200">عنوان</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-slate-200">وضعیت</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-slate-200">امتیاز</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-slate-200">بازدید</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-slate-200">کلیک</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-slate-200">عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAds.map(ad => (
                      <tr key={getEntityId(ad)} className="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800/60">
                        <td className="px-4 py-3">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-slate-100">{ad.title}</div>
                            <div className="text-sm text-gray-500 dark:text-slate-400">{ad.province} - {ad.city}</div>
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
                            <span className="text-sm text-gray-900 dark:text-slate-100">{ad.stars || 0}/5</span>
                            <div className="flex space-x-0.5 space-x-reverse">
                              {[1, 2, 3, 4, 5].map(star => (
                                <button
                                  key={star}
                                  onClick={() => handleRateAd(getEntityId(ad), star)}
                                  className={`${star <= (ad.stars || 0) ? 'text-yellow-500' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
                                >
                                  <Star className="w-5 h-5 fill-current" />
                                </button>
                              ))}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-slate-100">{ad.viewCount || 0}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-slate-100">{ad.clickCount || 0}</td>
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
                                  onClick={() => handleApprove(getEntityId(ad))}
                                  className="text-green-600 hover:text-green-800 text-sm"
                                >
                                  تایید
                                </button>
                                <button
                                  onClick={() => handleReject(getEntityId(ad))}
                                  className="text-red-600 hover:text-red-800 text-sm"
                                >
                                  رد
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleDelete(getEntityId(ad))}
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
                    <tr className="bg-gray-50 dark:bg-slate-800">
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-slate-200">نام</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-slate-200">نام کاربری</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-slate-200">شماره موبایل</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-slate-200">وضعیت</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-slate-200">تعداد آگهی</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-slate-200">عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={getEntityId(user)} className="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800/60">
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900 dark:text-slate-100">{user.name}</div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-slate-100">{user.username}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-slate-100">{user.phone}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user.isBanned ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {user.isBanned ? 'مسدود شده' : 'فعال'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-slate-100">{user.adsCount || 0}</td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2 space-x-reverse">
                            {user.isBanned ? (
                              <button
                                onClick={() => handleUnbanUser(getEntityId(user))}
                                className="text-green-600 hover:text-green-800 text-sm"
                              >
                                آزادسازی
                              </button>
                            ) : (
                              <button
                                onClick={() => handleBanUser(getEntityId(user))}
                                className="text-yellow-600 hover:text-yellow-800 text-sm"
                              >
                                مسدود کردن
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteUser(getEntityId(user))}
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