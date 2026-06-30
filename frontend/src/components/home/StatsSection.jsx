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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 mb-10">
      {[
        { value: stats.activeAds, label: 'آگهی فعال', color: 'bg-brand-700' },
        { value: stats.totalViews, label: 'بازدید', color: 'bg-emerald-700' },
        { value: stats.totalClicks, label: 'کلیک', color: 'bg-warm-700' },
        { value: stats.featuredAds, label: 'ویژه', color: 'bg-brand-600' }
      ].map((stat, index) => {
        const { Icon } = statIcons[index];
        return (
          <div
            key={stat.label}
            className="bg-white dark:bg-warm-800 rounded-xl p-3 lg:p-4 text-center border border-warm-200 dark:border-warm-700 hover:border-brand-400 dark:hover:border-brand-500 transition-colors duration-200"
          >
            <div className={`w-9 h-9 mx-auto mb-2 rounded-lg ${stat.color} flex items-center justify-center`}>
              <Icon className="w-4 h-4 text-white" />
            </div>
            <div className="text-xl lg:text-2xl font-black text-warm-900 dark:text-white mb-0.5">{stat.value.toLocaleString('fa-IR')}</div>
            <div className="text-warm-500 dark:text-warm-400 text-xs">{stat.label}</div>
          </div>
        );
      })}
    </div>
  );
});

StatsSection.displayName = 'StatsSection';

export default StatsSection;
