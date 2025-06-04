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

const Layout = ({ children }: LayoutProps) => {
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
    {
      name: 'Employés',
      href: '/',
      icon: Users,
      current: location.pathname === '/'
    },
    {
      name: 'Paramètres',
      href: '/settings',
      icon: Settings,
      current: location.pathname === '/settings'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Navigation latérale */}
      <nav className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Gestion des Employés
            </h1>
          </div>
          <div className="flex-1 px-3 py-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors
                  ${
                    item.current
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                <item.icon className={`mr-3 h-5 w-5 ${item.current ? 'text-white' : 'text-gray-400'}`} />
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="pl-64">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;