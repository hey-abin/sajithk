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

function AppContent({ isAdmin, handleLogin, setIsAdmin }: { isAdmin: boolean, handleLogin: (p: string) => void, setIsAdmin: (b: boolean) => void }) {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

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
              <AdminPanel onLogout={() => setIsAdmin(false)} />
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
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = (password: string) => {
    if (password === 'sajithadmin') {
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