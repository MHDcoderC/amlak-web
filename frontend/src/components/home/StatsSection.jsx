import { memo, useMemo } from 'react';
import { Home as HomeIcon, Eye, MousePointerClick, Star } from 'lucide-react';

const StatsSection = memo(({ filteredAds }) => {
  const stats = useMemo(() => ({
    activeAds: filteredAds.length,
    totalViews: filteredAds.reduce((sum, ad) => sum + (ad.viewCount || 0), 0),
    totalClicks: filteredAds.reduce((sum, ad) => sum + (ad.clickCount || 0), 0),
    featuredAds: filteredAds.filter((ad) => ad.stars === 5).length
  }), [filteredAds]);

  const statIcons = [
    { Icon: HomeIcon },
    { Icon: Eye },
    { Icon: MousePointerClick },
    { Icon: Star }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-12">
      {[
        { value: stats.activeAds, label: 'آگهی فعال', color: 'from-blue-500 to-blue-600' },
        { value: stats.totalViews, label: 'بازدید کل', color: 'from-green-500 to-emerald-600' },
        { value: stats.totalClicks, label: 'کلیک کل', color: 'from-purple-500 to-purple-600' },
        { value: stats.featuredAds, label: 'آگهی ویژه', color: 'from-orange-500 to-pink-600' }
      ].map((stat, index) => {
        const { Icon } = statIcons[index];
        return (
          <div
            key={stat.label}
            className="bg-white dark:bg-slate-800 rounded-2xl p-4 lg:p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
          >
            <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value.toLocaleString('fa-IR')}</div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</div>
          </div>
        );
      })}
    </div>
  );
});

StatsSection.displayName = 'StatsSection';

export default StatsSection;
