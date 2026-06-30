import { memo } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import { BarChart3, TrendingUp } from 'lucide-react';

const AdminCharts = memo(({ statusChartData, viewsChartData }) => (
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
                  font: { family: 'Vazirmatn', size: 14 }
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
            plugins: { legend: { display: false } },
            scales: {
              y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.1)' } },
              x: { grid: { color: 'rgba(0,0,0,0.1)' } }
            }
          }}
        />
      </div>
    </div>
  </div>
));

AdminCharts.displayName = 'AdminCharts';
export default AdminCharts;
