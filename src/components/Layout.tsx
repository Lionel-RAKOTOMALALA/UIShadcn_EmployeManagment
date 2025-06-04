import React, { ReactNode, useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Users, 
  Home, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Moon, 
  Sun,
  ChevronRight,
  LayoutGrid
} from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { gsap } from 'gsap';
import { useTranslation } from '../hooks/useTranslation';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme, toggleTheme } = useThemeStore();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { t } = useTranslation();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Animate sidebar elements
    const sidebarTimeline = gsap.timeline();
    
    if (sidebarOpen) {
      sidebarTimeline.fromTo(
        ".sidebar-item",
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.05, ease: "power2.out" }
      );
    }
  }, [sidebarOpen]);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const navigation = [
    { name: t('dashboard'), href: '/', icon: LayoutGrid },
    { name: t('visitors'), href: '/visitors', icon: Users },
    { name: t('settings'), href: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile sidebar overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-neutral-900 shadow-md transform transition-transform duration-300 md:relative md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-5 border-b border-gray-200 dark:border-neutral-800">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-600 text-white p-2 rounded-lg">
                <Users className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold text-primary-900 dark:text-primary-100">
                VisitManager
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-grow px-4 py-6 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    isActive
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-neutral-700'
                  } group flex items-center px-3 py-3 rounded-lg text-sm font-medium`}
                >
                  <Icon
                    className={`${
                      isActive ? 'text-gray-500 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'
                    } mr-3 flex-shrink-0 h-6 w-6`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Section */}
          <div className="p-4 border-t border-gray-200 dark:border-neutral-800">
            <button
              onClick={toggleTheme}
              className="sidebar-item flex w-full items-center px-3 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-neutral-800 transition-colors"
            >
              <span className="mr-3">
                {theme === 'dark' ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-blue-500" />}
              </span>
              {theme === 'dark' ? t('lightMode') : t('darkMode')}
            </button>
            <button className="sidebar-item flex w-full items-center px-3 py-3 mt-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-neutral-800 transition-colors">
              <span className="mr-3">
                <LogOut className="h-5 w-5 text-red-500" />
              </span>
              {t('logout')}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-neutral-900 shadow-sm z-10 border-b border-gray-200 dark:border-neutral-800">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={handleToggleSidebar}
                  className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 focus:outline-none transition-colors"
                >
                  {sidebarOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
                <div className="md:ml-0 ml-4">
                  <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
                    {navigation.find(item => item.href === location.pathname)?.name || t('welcome')}
                  </h1>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <span>{t('home')}</span>
                    <ChevronRight className="h-3 w-3 mx-1" />
                    <span>
                      {navigation.find(item => item.href === location.pathname)?.name || t('welcome')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center ml-4">
                <div className="relative">
                  <div className="flex items-center space-x-3">
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Gabriel
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Gabriel@visitmanager.com
                      </span>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white">
                      G
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-neutral-900 p-4 sm:p-6">
          <div className="page-transition mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;