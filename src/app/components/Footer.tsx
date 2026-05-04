import { Instagram, Youtube, Mail } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useEffect, useState } from 'react';

export default function Footer() {
  const [settings, setSettings] = useState<any>({});

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

  return (
    <footer className="bg-[#2D2D2D] text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-[#0EA5E9] rounded-full shadow-lg shadow-[#0EA5E9]/20" />
              <h3 className="font-black text-xl tracking-tighter uppercase">{settings.contact?.name || 'SAJITH K'}</h3>
            </div>
            <p className="text-white/70">
              {settings.about?.description || 'Visual storyteller creating captivating content through videography, photography, and creative editing.'}
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-white/70">
              <li><a href="/" className="hover:text-[#0EA5E9] transition-colors">Home</a></li>
              <li><a href="/projects" className="hover:text-[#0EA5E9] transition-colors">Projects</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Connect</h4>
            <div className="flex gap-4">
              <a
                href={settings.contact?.instagram ? `https://instagram.com/${settings.contact.instagram.replace('@', '')}` : "https://instagram.com/sajith.k"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-[#0EA5E9] hover:bg-white hover:text-[#2D2D2D] rounded-full flex items-center justify-center transition-all hover:-translate-y-1 text-white shadow-lg shadow-[#0EA5E9]/20"
                aria-label="Instagram"
              >
                <Instagram size={22} />
              </a>
              <a
                href={settings.contact?.youtube || "https://youtube.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-[#0EA5E9] hover:bg-white hover:text-[#2D2D2D] rounded-full flex items-center justify-center transition-all hover:-translate-y-1 text-white shadow-lg shadow-[#0EA5E9]/20"
                aria-label="YouTube"
              >
                <Youtube size={22} />
              </a>
              <a
                href={`mailto:${settings.contact?.email || 'sajithkizhyapattu@gmail.com'}`}
                className="w-12 h-12 bg-[#0EA5E9] hover:bg-white hover:text-[#2D2D2D] rounded-full flex items-center justify-center transition-all hover:-translate-y-1 text-white shadow-lg shadow-[#0EA5E9]/20"
                aria-label="Email"
              >
                <Mail size={22} />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-center text-white/70 text-sm">
          <p>&copy; {new Date().getFullYear()} Sajith K. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
