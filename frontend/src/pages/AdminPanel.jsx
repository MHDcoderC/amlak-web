import { useEffect, useState, useCallback, useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config/api';
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
  FileText,
  Ban,
  Users,
  Building
} from 'lucide-react';
import StatsCard from '../components/admin/StatsCard';
import AdminCharts from '../components/admin/AdminCharts';
import AdsTable from '../components/admin/AdsTable';
import UsersTable from '../components/admin/UsersTable';

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

      if (!token || !user || user.role !== 'admin') {
        console.error('Access denied: Admin only');
        navigate('/');
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      const [adsRes, statsRes, usersRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/ads/admin`, { headers }),
        axios.get(`${API_BASE_URL}/api/ads/stats`, { headers }),
        axios.get(`${API_BASE_URL}/api/users/admin`, { headers })
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
      await axios.patch(`${API_BASE_URL}/api/ads/${id}/status`, { status: 'approved' }, {
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
      await axios.patch(`${API_BASE_URL}/api/ads/${id}/status`, { status: 'rejected' }, {
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
        await axios.patch(`${API_BASE_URL}/api/users/admin/${userId}`, { isBanned: true }, {
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
      await axios.patch(`${API_BASE_URL}/api/users/admin/${userId}`, { isBanned: false }, {
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
      fetchData();
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard icon={Building} label="کل آگهی‌ها" value={stats.totalAds || 0} colorClass="bg-blue-100 dark:bg-blue-900/30 text-blue-600" />
          <StatsCard icon={Eye} label="کل بازدید" value={stats.totalViews || 0} colorClass="bg-green-100 dark:bg-green-900/30 text-green-600" />
          <StatsCard icon={MousePointerClick} label="کل کلیک" value={stats.totalClicks || 0} colorClass="bg-violet-100 dark:bg-violet-900/30 text-violet-600" />
          <StatsCard icon={Clock} label="در انتظار تایید" value={stats.pendingAds || 0} colorClass="bg-amber-100 dark:bg-amber-900/30 text-amber-600" />
        </div>

        <AdminCharts statusChartData={statusChartData} viewsChartData={viewsChartData} />

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
            <AdsTable
              ads={filteredAds}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              onViewAd={handleViewAd}
              onApprove={handleApprove}
              onReject={handleReject}
              onDelete={handleDelete}
              onRateAd={handleRateAd}
            />
          )}

          {activeTab === 'users' && (
            <UsersTable
              users={users}
              onBanUser={handleBanUser}
              onUnbanUser={handleUnbanUser}
              onDeleteUser={handleDeleteUser}
            />
          )}
        </div>
      </div>

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
