import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../../lib/supabase';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<any>({});
  const location = useLocation();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase.from('site_settings').select('*');
    if (data) {
      const settsMap: any = {};
      data.forEach(s => { settsMap[s.key] = s.value; });
      setSettings(settsMap);
    }
  };

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/projects', label: 'Projects' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#2D2D2D]/5">
      <div className="max-w-7xl mx-auto px-6 h-16 md:h-20 flex justify-between items-center">
        <Link to="/" className="font-black text-lg md:text-xl tracking-tighter flex items-center gap-2">
          <div className="w-6 h-6 bg-[#0EA5E9] rounded-full" />
          <span className="text-[#2D2D2D] uppercase">{settings.contact?.name || 'SAJITH K'}</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-xs font-bold uppercase tracking-widest transition-colors ${
                location.pathname === item.path
                  ? 'text-[#0EA5E9]'
                  : 'text-[#2D2D2D]/50 hover:text-[#2D2D2D]'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-[#2D2D2D]"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-[#2D2D2D]/5 shadow-xl"
          >
            <div className="p-6 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block py-4 px-4 rounded-xl font-bold uppercase tracking-widest text-sm ${
                    location.pathname === item.path
                      ? 'bg-[#0EA5E9]/10 text-[#0EA5E9]'
                      : 'text-[#2D2D2D]/60'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
