import React, { useEffect, useState } from 'react';
import { useEmployeeStore } from '../store/employeeStore';
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
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { gsap } from 'gsap';
import { Users, DollarSign, TrendingUp, Search, Bell, Settings } from 'lucide-react';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

interface Stats {
  totalEmployees: number;
  totalSalaires: number;
  moyenneSalaire: number;
  minSalaire: number;
  maxSalaire: number;
}

interface Employee {
  numEmp?: number;
  nom: string;
  salaire: number;
  observation?: string;
}

const Header = () => (
  <div className="flex justify-between items-center mb-8">
    <div className="flex items-center space-x-4">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
        Dashboard
      </h1>
    </div>
    <div className="flex items-center space-x-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search..."
          className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
        <Bell className="h-5 w-5 text-gray-500" />
      </button>
      <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
        <Settings className="h-5 w-5 text-gray-500" />
      </button>
    </div>
  </div>
);

const SalesDistribution = ({ stats }: { stats: Stats }) => (
  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl mb-6">
    <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Salary Distribution</h2>
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">This is all over Platform Salary Generated</p>
    <div className="grid grid-cols-4 gap-4">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          {stats.totalSalaires.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Total Salaries</p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          {stats.moyenneSalaire.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Average (40%)</p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          {stats.maxSalaire.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Maximum (25%)</p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          {stats.minSalaire.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Minimum (15%)</p>
      </div>
    </div>
  </div>
);

const EmployeeTable = ({ employees }: { employees: Employee[] }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-6 overflow-hidden">
    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Employees Overview</h2>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Employee
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Salary
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Observation
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {employees.map((employee) => (
            <tr key={employee.numEmp}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                      {employee.nom[0]}
                    </span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {employee.nom}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-white">
                  {employee.salaire.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${employee.observation === 'mediocre' ? 'bg-red-100 text-red-800' : 
                    employee.observation === 'moyen' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-green-100 text-green-800'}`}>
                  {employee.observation}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500 dark:text-gray-400">Active</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const Charts = ({ employees, theme }: { employees: Employee[], theme: string }) => {
  const monthlyData = Array.from({ length: 12 }, (_, i) => ({
    name: new Date(2024, i).toLocaleString('default', { month: 'short' }),
    value: Math.floor(Math.random() * 5000) + 1000
  }));

  const pieData = employees.map(emp => ({
    name: emp.nom,
    value: emp.salaire
  }));

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Yearly Overview
        </h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="name" stroke={theme === 'dark' ? '#9ca3af' : '#4b5563'} />
              <YAxis stroke={theme === 'dark' ? '#9ca3af' : '#4b5563'} />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                  border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#6366f1"
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Salary Distribution
        </h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                  border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { employees, fetchEmployees, loading, error } = useEmployeeStore();
  const { theme } = useThemeStore();
  const { t } = useTranslation();

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const stats = employees.length > 0 ? {
    totalEmployees: employees.length,
    totalSalaires: employees.reduce((sum, emp) => sum + emp.salaire, 0),
    moyenneSalaire: employees.reduce((sum, emp) => sum + emp.salaire, 0) / employees.length,
    minSalaire: Math.min(...employees.map(emp => emp.salaire)),
    maxSalaire: Math.max(...employees.map(emp => emp.salaire))
  } : {
    totalEmployees: 0,
    totalSalaires: 0,
    moyenneSalaire: 0,
    minSalaire: 0,
    maxSalaire: 0
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <Header />
      
      {error && (
        <div className="mb-6 bg-red-100 dark:bg-red-500/20 border border-red-400 text-red-700 dark:text-red-100 px-4 py-3 rounded-lg">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <SalesDistribution stats={stats} />
      <EmployeeTable employees={employees} />
      <Charts employees={employees} theme={theme} />
    </div>
  );
};

export default Dashboard;