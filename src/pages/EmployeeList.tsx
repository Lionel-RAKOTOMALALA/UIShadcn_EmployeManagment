import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, Loader2, Search, Bell, Settings, Globe, DollarSign } from 'lucide-react';
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
  Cell
} from 'recharts';
import Swal from 'sweetalert2';
import { gsap } from 'gsap';
import { useEmployeeStore } from '../store/employeeStore';
import { useTranslation } from '../hooks/useTranslation';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

const CURRENCIES = [
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'GBP', symbol: '£', label: 'British Pound' }
];

const LANGUAGES = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' }
];

interface Employee {
  numEmp?: number;
  nom: string;
  salaire: number;
  observation?: string;
}

const Header = ({ 
  currentLanguage, 
  setCurrentLanguage, 
  currentCurrency, 
  setCurrentCurrency 
}: { 
  currentLanguage: string;
  setCurrentLanguage: (code: string) => void;
  currentCurrency: string;
  setCurrentCurrency: (code: string) => void;
}) => {
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {t('employeeManagement')}
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder={t('search')}
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
          >
            <Globe className="h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {LANGUAGES.find(lang => lang.code === currentLanguage)?.label}
            </span>
          </button>
          {showLanguageMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
              <div className="py-1" role="menu">
                {LANGUAGES.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => {
                      setCurrentLanguage(language.code);
                      setShowLanguageMenu(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      currentLanguage === language.code
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {language.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Currency Selector */}
        <div className="relative">
          <button
            onClick={() => setShowCurrencyMenu(!showCurrencyMenu)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
          >
            <DollarSign className="h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {CURRENCIES.find(curr => curr.code === currentCurrency)?.code}
            </span>
          </button>
          {showCurrencyMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
              <div className="py-1" role="menu">
                {CURRENCIES.map((currency) => (
                  <button
                    key={currency.code}
                    onClick={() => {
                      setCurrentCurrency(currency.code);
                      setShowCurrencyMenu(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      currentCurrency === currency.code
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {currency.label} ({currency.symbol})
                  </button>
                ))}
              </div>
            </div>
          )}
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
};

const SalaryDistribution = ({ stats, currentCurrency }: { stats: any, currentCurrency: string }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl mb-6">
      <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{t('salaryDistribution')}</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t('employeesOverview')}</p>
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.totalSalaire.toLocaleString('fr-FR', { style: 'currency', currency: currentCurrency })}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('totalSalaries')}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {(stats.totalSalaire * 0.4).toLocaleString('fr-FR', { style: 'currency', currency: currentCurrency })}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('averageSalary')}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.maxSalaire.toLocaleString('fr-FR', { style: 'currency', currency: currentCurrency })}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('maximumSalary')}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.minSalaire.toLocaleString('fr-FR', { style: 'currency', currency: currentCurrency })}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('minimumSalary')}</p>
        </div>
      </div>
    </div>
  );
};

const Charts = ({ employees, currentCurrency }: { employees: Employee[], currentCurrency: string }) => {
  const { t } = useTranslation();

  const salaryData = [
    {
      name: t('totalSalaries'),
      value: employees.reduce((sum, emp) => sum + emp.salaire, 0),
      fill: '#6366f1'
    },
    {
      name: t('averageSalary'),
      value: employees.reduce((sum, emp) => sum + emp.salaire, 0) / employees.length,
      fill: '#22c55e'
    },
    {
      name: t('maximumSalary'),
      value: Math.max(...employees.map(emp => emp.salaire)),
      fill: '#f59e0b'
    },
    {
      name: t('minimumSalary'),
      value: Math.min(...employees.map(emp => emp.salaire)),
      fill: '#ef4444'
    }
  ];

  const pieData = employees.map(emp => ({
    name: emp.nom,
    value: emp.salaire
  }));

  const formatCurrency = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currentCurrency
    }).format(numValue);
  };

  return (
    <div className="grid grid-cols-3 gap-6 mb-6">
      <div className="col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('salaryDistribution')}
          </h3>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={salaryData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: 'currentColor' }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tick={{ fill: 'currentColor' }}
                tickFormatter={formatCurrency}
              />
              <Tooltip 
                formatter={formatCurrency}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '10px'
                }}
              />
              <Bar 
                dataKey="value" 
                radius={[8, 8, 0, 0]}
              >
                {salaryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          {t('salaryDistribution')}
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
              <Tooltip formatter={formatCurrency} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const formatCurrency = (amount: number, currencyCode: string) => {
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: currencyCode 
  }).format(amount);
};

// Add this function at the top level, before the EmployeeList component
const initializeAnalytics = async () => {
  try {
    // Check if analytics is blocked
    const testRequest = await fetch('https://www.google-analytics.com/analytics.js', {
      method: 'HEAD',
      mode: 'no-cors'
    });
    
    // If we reach here, analytics is not blocked
    return true;
  } catch (error) {
    console.warn('Analytics might be blocked by an ad blocker. This won\'t affect the application functionality.');
    return false;
  }
};

const EmployeeList = () => {
  const { 
    employees, 
    loading, 
    error, 
    fetchEmployees, 
    addEmployee, 
    updateEmployee, 
    deleteEmployee,
    getStatistics 
  } = useEmployeeStore();
  const { t, setLanguage } = useTranslation();
  
  const [currentLanguage, setCurrentLanguage] = useState('fr');
  const [currentCurrency, setCurrentCurrency] = useState('EUR');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nom: '',
    salaire: ''
  });
  const tableRef = useRef<HTMLDivElement>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    // Initialize analytics silently
    initializeAnalytics().catch(() => {});
    
    console.log('EmployeeList mounted, fetching employees...');
    fetchEmployees();

    return () => {
      gsap.killTweensOf(".employee-row");
    };
  }, [fetchEmployees]);

  useEffect(() => {
    if (!loading && employees.length > 0 && tableRef.current) {
      gsap.fromTo(
        ".employee-row",
        { 
          opacity: 0,
          y: 20
        },
        { 
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power3.out",
          clearProps: "all"
        }
      );
    }
  }, [loading, employees]);

  useEffect(() => {
    setLanguage(currentLanguage);
  }, [currentLanguage, setLanguage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEmployee !== null) {
        await updateEmployee(editingEmployee, {
          nom: formData.nom,
          salaire: Number(formData.salaire)
        });
      } else {
        await addEmployee({
          nom: formData.nom,
          salaire: Number(formData.salaire)
        });
      }
      setIsModalOpen(false);
      setEditingEmployee(null);
      setFormData({ nom: '', salaire: '' });
    } catch (error) {
      Swal.fire({
        title: 'Erreur',
        text: error instanceof Error ? error.message : 'Une erreur est survenue',
        icon: 'error'
      });
    }
  };

  const handleEdit = (employee: Employee) => {
    if (employee.numEmp) {
      setSelectedEmployee(employee);
      setEditingEmployee(employee.numEmp);
      setFormData({
        nom: employee.nom,
        salaire: employee.salaire.toString()
      });
      setIsModalOpen(true);
    }
  };

  const handleDelete = async (numEmp: number) => {
    if (window.confirm(t('confirmDelete'))) {
      await deleteEmployee(numEmp);
    }
  };

  const stats = getStatistics();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <Header 
        currentLanguage={currentLanguage}
        setCurrentLanguage={setCurrentLanguage}
        currentCurrency={currentCurrency}
        setCurrentCurrency={setCurrentCurrency}
      />
      
      {error && (
        <div className="mb-6 bg-red-100 dark:bg-red-500/20 border border-red-400 text-red-700 dark:text-red-100 px-4 py-3 rounded-lg">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <SalaryDistribution stats={stats} currentCurrency={currentCurrency} />

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-6 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('employeesOverview')}</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            {t('addEmployee')}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('employee')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('salary')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('observation')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    {t('noEmployees')}
                  </td>
                </tr>
              ) : (
                employees.map((employee) => (
                  <tr key={employee.numEmp} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
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
                        {formatCurrency(employee.salaire, currentCurrency)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${employee.observation === 'mediocre' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 
                          employee.observation === 'moyen' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
                          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}`}>
                        {t(employee.observation || '')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                        onClick={() => handleEdit(employee)}
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button 
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        onClick={() => employee.numEmp && handleDelete(employee.numEmp)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Charts employees={employees} currentCurrency={currentCurrency} />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              {editingEmployee !== null ? t('editEmployee') : t('newEmployee')}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('name')}
                </label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="mt-1 w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('salary')}
                </label>
                <input
                  type="number"
                  value={formData.salaire}
                  onChange={(e) => setFormData({ ...formData, salaire: e.target.value })}
                  className="mt-1 w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingEmployee(null);
                    setFormData({ nom: '', salaire: '' });
                  }}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-md transition-colors"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                >
                  {editingEmployee !== null ? t('save') : t('add')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList; 