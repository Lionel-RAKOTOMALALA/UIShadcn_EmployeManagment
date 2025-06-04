import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useThemeStore } from './store/themeStore';
import Layout from './components/Layout';
import EmployeeList from './pages/EmployeeList';
import Settings from './pages/Settings';
import { gsap } from 'gsap';

function App() {
  const { theme } = useThemeStore();
  
  useEffect(() => {
    document.documentElement.className = theme;
    
    // GSAP page transition animation
    gsap.fromTo(
      ".page-transition",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" }
    );
  }, [theme]);

  return (
    <div className={`${theme} min-h-screen bg-gray-50 dark:bg-neutral-900 text-neutral-900 dark:text-white transition-colors duration-300`}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<EmployeeList />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </Router>
    </div>
  );
}

export default App;