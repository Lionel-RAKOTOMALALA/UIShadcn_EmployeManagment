import React, { useEffect, useState } from 'react';
import { useVisitorStore } from '../store/visitorStore';
import { useThemeStore } from '../store/themeStore';
import { useTranslation } from '../hooks/useTranslation';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Sector,
  ComposedChart
} from 'recharts';
import { gsap } from 'gsap';
import { 
  Users, 
  DollarSign, 
  Calendar, 
  AlertCircle, 
  TrendingUp,
  TrendingDown,
  Hash,
  BarChart2
} from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, color }) => (
  <div className="relative overflow-hidden bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
    <div className="relative z-10 flex items-center space-x-4">
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
      </div>
    </div>
    <div className={`absolute inset-0 opacity-10 dark:opacity-20 ${color.includes('indigo') ? 'bg-indigo-500' : color.includes('emerald') ? 'bg-emerald-500' : color.includes('violet') ? 'bg-violet-500' : 'bg-rose-500'}`}></div>
  </div>
);

const Dashboard = () => {
  const { visitors, fetchVisitors, loading, error } = useVisitorStore();
  const { theme } = useThemeStore();
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetchVisitors();
  }, []);

  useEffect(() => {
    if (!loading && visitors.length > 0) {
      gsap.from('.dashboard-card', {
        duration: 0.8,
        y: 20,
        opacity: 0,
        stagger: 0.2,
        ease: 'power3.out'
      });
    }
  }, [loading, visitors]);

  const totalVisitors = visitors.length;
  const totalRevenue = visitors.reduce((sum, visitor) => sum + (visitor.totalAmount || 0), 0);
  const averageStay = visitors.length > 0
    ? visitors.reduce((sum, visitor) => sum + visitor.days, 0) / visitors.length
    : 0;

  // Calcul des statistiques des tarifs
  const dailyRates = visitors.map(visitor => visitor.dailyRate || 0);
  const totalRate = dailyRates.reduce((sum, rate) => sum + rate, 0);
  const minRate = Math.min(...dailyRates);
  const maxRate = Math.max(...dailyRates);

  // Données pour le graphique des tarifs
  const rateData = visitors
    .map(visitor => ({
      name: visitor.name.split(' ')[0],
      dailyRate: visitor.dailyRate || 0,
      totalAmount: visitor.totalAmount || 0
    }))
    .sort((a, b) => b.dailyRate - a.dailyRate);

  // Données pour les graphiques
  const revenueData = visitors.map((visitor, index) => ({
    name: visitor.name.split(' ')[0], // Prendre seulement le prénom pour plus de clarté
    revenue: visitor.totalAmount || 0,
    stay: visitor.days || 0,
    amt: index
  })).sort((a, b) => b.revenue - a.revenue); // Trier par revenu décroissant

  // Données pour le graphique circulaire
  const stayDistribution = visitors.reduce((acc, visitor) => {
    const stayRange = Math.floor(visitor.days / 5) * 5;
    const key = `${stayRange}-${stayRange + 4}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(stayDistribution)
    .map(([range, count]) => ({
      name: `${range} ${t('days')}`,
      value: count
    }))
    .sort((a, b) => {
      const aStart = parseInt(a.name.split('-')[0]);
      const bStart = parseInt(b.name.split('-')[0]);
      return aStart - bStart;
    });

  const COLORS = ['#6366f1', '#60a5fa', '#34d399', '#fbbf24', '#f87171'];

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  // Données pour le graphique des tarifs
  const rateComparisonData = [
    {
      name: t('totalRate'),
      value: totalRate,
      color: '#6366f1' // indigo
    },
    {
      name: t('minRate'),
      value: minRate,
      color: '#ef4444' // red
    },
    {
      name: t('maxRate'),
      value: maxRate,
      color: '#10b981' // emerald
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-300">{t('loading')}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => fetchVisitors()} 
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          {t('retry')}
        </button>
      </div>
    );
  }

  if (visitors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Users className="h-12 w-12 text-gray-400" />
        <p className="text-gray-500 dark:text-gray-400">{t('noVisitors')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          title={t('totalVisitors')}
          value={totalVisitors}
          color="bg-indigo-100 text-indigo-600 dark:bg-indigo-600/20 dark:text-indigo-400"
        />
        <StatCard
          icon={DollarSign}
          title={t('totalRevenue')}
          value={`$${totalRevenue.toFixed(2)}`}
          color="bg-emerald-100 text-emerald-600 dark:bg-emerald-600/20 dark:text-emerald-400"
        />
        <StatCard
          icon={Calendar}
          title={t('averageStay')}
          value={`${averageStay.toFixed(1)} ${t('days')}`}
          color="bg-violet-100 text-violet-600 dark:bg-violet-600/20 dark:text-violet-400"
        />
        <StatCard
          icon={Hash}
          title={t('totalRate')}
          value={`$${totalRate.toFixed(2)}`}
          color="bg-rose-100 text-rose-600 dark:bg-rose-600/20 dark:text-rose-400"
        />
      </div>

      {/* Rate Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative overflow-hidden bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <TrendingDown className="h-5 w-5 mr-2 text-red-500" />
                {t('minRate')}
              </h3>
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                ${minRate.toFixed(2)}
              </span>
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300">
              {t('dailyRate')}
            </div>
          </div>
          <div className="absolute inset-0 bg-red-500 opacity-5 dark:opacity-10"></div>
        </div>

        <div className="relative overflow-hidden bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                {t('maxRate')}
              </h3>
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                ${maxRate.toFixed(2)}
              </span>
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300">
              {t('dailyRate')}
            </div>
          </div>
          <div className="absolute inset-0 bg-green-500 opacity-5 dark:opacity-10"></div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Rate Comparison Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-6">
            <BarChart2 className="h-5 w-5 mr-2 text-primary-500" />
            {t('rateDistribution')}
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rateComparisonData}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} 
                />
                <XAxis 
                  dataKey="name" 
                  stroke={theme === 'dark' ? '#9ca3af' : '#4b5563'}
                />
                <YAxis 
                  stroke={theme === 'dark' ? '#9ca3af' : '#4b5563'}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                    border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                    color: theme === 'dark' ? '#ffffff' : '#000000'
                  }}
                  formatter={(value) => [`$${value}`, t('rate')]}
                />
                <Bar 
                  dataKey="value" 
                  radius={[4, 4, 0, 0]}
                >
                  {rateComparisonData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stay Distribution Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-6">
            <Calendar className="h-5 w-5 mr-2 text-primary-500" />
            {t('stayDistribution')}
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                    border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                    color: theme === 'dark' ? '#ffffff' : '#000000'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant pour la forme active du graphique circulaire
const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <text x={cx} y={cy + 20} dy={8} textAnchor="middle" fill={fill}>
        {`${value} (${(percent * 100).toFixed(2)}%)`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
    </g>
  );
};

export default Dashboard;