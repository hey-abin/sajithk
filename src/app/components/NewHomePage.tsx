import { motion, useScroll, useTransform } from 'motion/react';
import { Camera, Video, Palette, Film, Mail, Phone, Instagram, Youtube, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useEffect, useState } from 'react';
import img1 from '../../imports/IMG_4770.JPG';
import img2 from '../../imports/IMG_4886.PNG';

export default function NewHomePage() {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);

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
    setLoading(false);
  };

  const { scrollYProgress } = useScroll();

  return (
    <div className="min-h-screen bg-[#E8E8E8]">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 pt-24 pb-12">
        {/* Background decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#0EA5E9]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 right-20 w-40 h-40 bg-[#0EA5E9]/5 rounded-full blur-3xl animate-pulse" />

        <div className="max-w-7xl w-full mx-auto flex flex-col lg:grid lg:grid-cols-2 gap-12 items-center relative z-10 text-center lg:text-left">
          {/* Typography Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1"
          >
            <div className="relative inline-block lg:block">
              <span className="text-[10px] md:text-xs font-black border border-[#0EA5E9]/30 text-[#0EA5E9] px-4 py-1.5 rounded-full inline-block mb-6 uppercase tracking-[0.3em] bg-white/50 backdrop-blur-sm">
                {settings.hero?.tagline || 'Creative Visual'}
              </span>
              <h1 className="text-5xl md:text-8xl lg:text-9xl font-black leading-[0.9] mb-4 tracking-tighter uppercase break-words">
                <span className="text-[#2D2D2D]">
                  {settings.hero?.title || 'PORTO'}
                </span>
                <br />
                <span className="text-[#0EA5E9]">{settings.hero?.subtitle || 'FOLIO'}</span>
              </h1>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-4 mb-8">
              <div className="h-px w-8 bg-[#2D2D2D]/10" />
              <span className="font-bold text-sm tracking-widest uppercase text-[#2D2D2D]/30">Sajith K. 2026</span>
            </div>

            <Link to="/projects" className="inline-block">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-[#2D2D2D] text-white rounded-xl font-black uppercase tracking-widest text-[11px] shadow-xl hover:bg-[#0EA5E9] transition-all flex items-center gap-2"
              >
                View Works <ChevronRight size={14} />
              </motion.button>
            </Link>
          </motion.div>

          {/* 3D Image Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="order-1 lg:order-2 perspective-[1000px] w-full"
          >
            <motion.div 
              whileHover={{ rotateY: -10, rotateX: 10 }}
              style={{ transformStyle: 'preserve-3d' }}
              className="relative z-10 w-full max-w-[280px] md:max-w-[450px] mx-auto aspect-square group transition-all duration-500"
            >
              <div className="absolute inset-0 bg-[#0EA5E9] rounded-full translate-z-[-30px] opacity-10 blur-2xl group-hover:opacity-20 transition-opacity" />
              
              <div className="relative w-full h-full border-4 border-white bg-white rounded-full overflow-hidden shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-700">
                <img
                  src={img1}
                  alt="Sajith K"
                  className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
                />
              </div>

              {/* Floating Camera Icon */}
              <motion.div 
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-2 -right-2 bg-white p-3 rounded-2xl shadow-xl border border-gray-100 translate-z-[50px]"
              >
                <Camera className="w-5 h-5 text-[#0EA5E9]" />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:block"
        >
          <div className="w-px h-12 bg-gradient-to-b from-[#2D2D2D] to-transparent" />
        </motion.div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-4xl font-bold">About</h2>
            <div className="h-px flex-1 bg-[#2D2D2D]" />
            <ChevronRight className="w-8 h-8" />
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Profile Image */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative">
                <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-[#0EA5E9] rounded-tr-[150px]" />
                <div className="relative z-10">
                  <motion.img
                    whileHover={{ scale: 1.02 }}
                    src={img2}
                    alt="Sajith K Profile"
                    className="w-full max-w-md rounded-3xl shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
                  />
                </div>
              </div>

              {/* Contact Card */}
              <div className="mt-8 border-t border-[#2D2D2D]/10 pt-10">
                <h3 className="font-black text-xs uppercase tracking-[0.4em] text-[#0EA5E9] mb-8">
                  Get In Touch
                </h3>
                <div className="grid gap-6">
                  {[
                    { icon: Mail, label: 'Email', value: settings.contact?.email || 'sajithkizhyapattu@gmail.com', href: `mailto:${settings.contact?.email || 'sajithkizhyapattu@gmail.com'}` },
                    { icon: Phone, label: 'Phone', value: settings.contact?.phone || '+91 9567633217' },
                    { icon: Instagram, label: 'Instagram', value: settings.contact?.instagram || '@sajith.k' },
                  ].map((item, i) => (
                    <motion.a
                      key={item.label}
                      href={item.href}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 border border-[#2D2D2D]/10 rounded-full flex items-center justify-center group-hover:bg-[#0EA5E9] group-hover:border-[#0EA5E9] transition-all">
                          <item.icon className="w-4 h-4 text-[#2D2D2D]/40 group-hover:text-white transition-colors" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#2D2D2D]/30">{item.label}</p>
                          <p className="text-sm font-bold text-[#2D2D2D]">{item.value}</p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-[#2D2D2D]/20 group-hover:text-[#0EA5E9] group-hover:translate-x-1 transition-all" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* About Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div>
                <span className="text-5xl text-[#0EA5E9] font-bold">&quot;&quot;</span>
                <h3 className="text-4xl font-bold inline ml-2 uppercase tracking-tighter">{settings.about?.title || 'HELLO'}</h3>
                <span className="text-[#0EA5E9] text-4xl">.</span>
              </div>

              <p className="text-lg leading-relaxed text-[#2D2D2D]/70">
                {settings.about?.description || 'Visual storyteller creating captivating content through videography, photography, and creative editing.'}
              </p>

              <div className="grid sm:grid-cols-2 gap-8 mt-8">
                <div>
                  <h4 className="font-bold text-xl mb-4">Skills</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#0EA5E9] rounded-full" />
                      <span>Videography</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#0EA5E9] rounded-full" />
                      <span>Photography</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#0EA5E9] rounded-full" />
                      <span>Video Editing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#0EA5E9] rounded-full" />
                      <span>Color Grading</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-xl mb-6 tracking-tight">Software Mastery</h4>
                  <div className="flex flex-wrap gap-4">
                    {[
                      { name: 'PS', color: '#31A8FF', label: 'Photoshop' },
                      { name: 'LR', color: '#31A8FF', label: 'Lightroom' },
                      { name: 'AE', color: '#CF96FD', label: 'After Effects' },
                      { name: 'PR', color: '#E48BFF', label: 'Premiere Pro' },
                      { name: 'CC', color: '#FF3C3C', label: 'Creative Cloud' },
                    ].map((software) => (
                      <motion.div
                        key={software.name}
                        whileHover={{ 
                          scale: 1.1, 
                          rotateY: 20,
                          boxShadow: `0 20px 40px ${software.color}33`
                        }}
                        className="relative group cursor-pointer"
                      >
                        <div 
                          className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl transition-all duration-500 border-2"
                          style={{ 
                            backgroundColor: '#2D2D2D',
                            borderColor: 'transparent',
                            color: software.color 
                          }}
                        >
                          {software.name}
                        </div>
                        {/* 3D Glow Effect on Hover */}
                        <div 
                          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10"
                          style={{ backgroundColor: software.color }}
                        />
                        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-[#2D2D2D]/40">
                          {software.label}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Table of Content */}
      <section className="py-20 px-4 bg-[#E8E8E8]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-4xl font-bold">Table Of Content</h2>
            <div className="h-px flex-1 bg-[#2D2D2D]" />
            <ChevronRight className="w-8 h-8" />
          </div>

          <div className="text-center mb-16 overflow-hidden">
            <h3 className="text-4xl md:text-7xl font-black text-[#2D2D2D] opacity-10 absolute left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              CONTENT.
            </h3>
            <h3 className="text-3xl md:text-6xl font-black relative">
              <span className="text-[#2D2D2D]">TABLE </span>
              <span className="text-[#0EA5E9]">OF </span>
              <span className="text-[#2D2D2D]">CONTENT</span>
              <span className="text-[#0EA5E9]">.</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#2D2D2D]/10 mt-20 border border-[#2D2D2D]/10">
            {[
              { icon: Palette, title: 'Graphic Design', desc: 'Visual identity & brand systems' },
              { icon: Camera, title: 'Photography', desc: 'Capturing moments in time' },
              { icon: Video, title: 'Videography', desc: 'Cinematic storytelling' },
              { icon: Film, title: 'Visual Editor', desc: 'Post-production & grading' },
            ].map((item, index) => (
              <Link to="/projects" key={item.title} className="group">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-10 md:p-16 flex flex-col h-full relative overflow-hidden hover:bg-[#0EA5E9] transition-colors duration-500"
                >
                  <span className="text-8xl md:text-[12rem] font-black absolute -right-4 -bottom-8 text-black/5 group-hover:text-white/10 transition-colors pointer-events-none">
                    0{index + 1}
                  </span>
                  
                  <div className="relative z-10 space-y-6">
                    <div className="w-16 h-16 rounded-2xl bg-[#0EA5E9]/10 group-hover:bg-white/20 flex items-center justify-center transition-colors">
                      <item.icon className="w-8 h-8 text-[#0EA5E9] group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h4 className="text-3xl md:text-4xl font-black tracking-tighter uppercase group-hover:text-white transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[#2D2D2D]/50 group-hover:text-white/60 font-medium uppercase tracking-widest text-xs mt-2 transition-colors">
                        {item.desc}
                      </p>
                    </div>
                    <div className="pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-2 text-white font-bold text-sm uppercase tracking-widest">
                        Explore Works <ChevronRight size={16} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="text-[#2D2D2D]">Let&apos;s Create </span>
              <br />
              <span className="text-[#0EA5E9] italic tracking-tighter">Something Amazing</span>
              <span className="text-[#0EA5E9]">.</span>
            </h2>
            <p className="text-xl text-[#2D2D2D]/70 mb-8">
              Ready to bring your vision to life with stunning visuals?
            </p>
            <Link to="/projects">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(14, 165, 233, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-5 bg-[#0EA5E9] text-white rounded-full font-black text-xl shadow-xl shadow-[#0EA5E9]/20 transition-all uppercase tracking-widest"
              >
                View My Work
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
