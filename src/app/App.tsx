import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navigation from './components/Navigation';
import NewHomePage from './components/NewHomePage';
import NewProjectsPage from './components/NewProjectsPage';
import Footer from './components/Footer';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import { useState } from 'react';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const setCookie = (name: string, value: string, days: number) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "; expires=" + date.toUTCString();
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
};

const getCookie = (name: string) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

const eraseCookie = (name: string) => {
  document.cookie = name + '=; Max-Age=-99999999; path=/;';
};

function AppContent({ isAdmin, handleLogin, setIsAdmin }: { isAdmin: boolean, handleLogin: (p: string) => void, setIsAdmin: (b: boolean) => void }) {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  const handleLogout = () => {
    eraseCookie('isAdmin');
    setIsAdmin(false);
  };

  return (
    <div className="min-h-screen bg-[#E8E8E8]">
      <ScrollToTop />
      {!isAdminPage && <Navigation />}
      <Routes>
        <Route path="/" element={<NewHomePage />} />
        <Route path="/projects" element={<NewProjectsPage />} />
        <Route 
          path="/admin" 
          element={
            isAdmin ? (
              <AdminPanel onLogout={handleLogout} />
            ) : (
              <AdminLogin onLogin={handleLogin} />
            )
          } 
        />
      </Routes>
      {!isAdminPage && <Footer />}
    </div>
  );
}

export default function App() {
  const [isAdmin, setIsAdmin] = useState(() => {
    return getCookie('isAdmin') === 'true';
  });

  const handleLogin = (password: string) => {
    if (password === 'sajithadmin') {
      setCookie('isAdmin', 'true', 2);
      setIsAdmin(true);
    } else {
      alert('Invalid password');
    }
  };

  return (
    <Router>
      <AppContent isAdmin={isAdmin} handleLogin={handleLogin} setIsAdmin={setIsAdmin} />
    </Router>
  );
}