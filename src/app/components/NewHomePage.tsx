import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'motion/react';
import { Camera, Video, Palette, Film, Mail, Phone, Instagram, Youtube, ChevronRight, Sparkles, Monitor, Edit3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useEffect, useState, useRef } from 'react';

const iconMap: any = {
  Camera, Video, Palette, Film, Sparkles, Monitor, Edit3
};

function IconResolver({ name, size = 12, className = "" }: { name: string, size?: number, className?: string }) {
  const Icon = iconMap[name] || Camera;
  return <Icon size={size} className={className} />;
}
export default function NewHomePage() {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Mouse Tracking for 3D Parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-15, 15]);
  
  // Parallax for background orbs
  const orbX1 = useTransform(smoothMouseX, [-0.5, 0.5], [-50, 50]);
  const orbY1 = useTransform(smoothMouseY, [-0.5, 0.5], [-50, 50]);
  const orbX2 = useTransform(smoothMouseX, [-0.5, 0.5], [30, -30]);
  const orbY2 = useTransform(smoothMouseY, [-0.5, 0.5], [30, -30]);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set(clientX / innerWidth - 0.5);
    mouseY.set(clientY / innerHeight - 0.5);
    cursorX.set(clientX);
    cursorY.set(clientY);
  };

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
    <div 
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-[#E8E8E8] relative selection:bg-[#0EA5E9] selection:text-white"
    >
      {/* Cinematic Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] mix-blend-overlay">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      {/* Custom Follower Cursor */}
      <motion.div 
        className="fixed w-6 h-6 border-2 border-[#0EA5E9] rounded-full pointer-events-none z-[200] hidden md:flex items-center justify-center"
        style={{ 
          x: useSpring(cursorX, { damping: 30, stiffness: 300 }), 
          y: useSpring(cursorY, { damping: 30, stiffness: 300 }) 
        }}
      >
        <div className="w-1 h-1 bg-[#0EA5E9] rounded-full" />
      </motion.div>

      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          style={{ x: orbX1, y: orbY1 }}
          className="absolute top-[10%] left-[15%] w-[40vw] h-[40vw] bg-[#0EA5E9]/5 rounded-full blur-[120px]" 
        />
        <motion.div 
          style={{ x: orbX2, y: orbY2 }}
          className="absolute bottom-[10%] right-[10%] w-[35vw] h-[35vw] bg-[#0EA5E9]/10 rounded-full blur-[100px]" 
        />
      </div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 pt-24 pb-12">
        {/* Background decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#0EA5E9]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 right-20 w-40 h-40 bg-[#0EA5E9]/5 rounded-full blur-3xl animate-pulse" />

        <div className="max-w-7xl w-full mx-auto flex flex-col lg:grid lg:grid-cols-2 gap-12 items-center relative z-10 text-center lg:text-left">
          {/* Typography Section */}
          <motion.div
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1 perspective-[1000px]"
          >
            <div className="relative inline-block lg:block translate-z-[50px]">
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

            <div className="flex items-center justify-center lg:justify-start gap-4 mb-8 translate-z-[30px]">
              <div className="h-px w-8 bg-[#2D2D2D]/10" />
              <span className="font-bold text-sm tracking-widest uppercase text-[#2D2D2D]/30">Sajith K. 2026</span>
            </div>

            <Link to="/projects" className="inline-block translate-z-[40px]">
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: '#0EA5E9' }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-[#2D2D2D] text-white rounded-xl font-black uppercase tracking-widest text-[11px] shadow-xl transition-all flex items-center gap-2"
              >
                View Works <ChevronRight size={14} />
              </motion.button>
            </Link>
          </motion.div>

          <motion.div
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
            className="order-1 lg:order-2 perspective-[1000px] w-full"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              style={{ transformStyle: 'preserve-3d' }}
              className="relative z-10 w-full max-w-[280px] md:max-w-[450px] mx-auto aspect-square group transition-all duration-500"
            >
              <div className="absolute inset-0 bg-[#0EA5E9] rounded-full translate-z-[-30px] opacity-10 blur-2xl group-hover:opacity-20 transition-opacity" />
              
              <div className="relative w-full h-full border-4 border-white bg-white rounded-full overflow-hidden shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-700">
                <img
                  src={settings.hero?.image_url}
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

      {/* About Section - Single Frame Layout */}
      <section className="min-h-screen py-20 px-6 bg-white relative flex items-center overflow-hidden">
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-3xl font-black uppercase tracking-widest text-[#2D2D2D]/20 italic">About Me</h2>
            <div className="h-px flex-1 bg-[#2D2D2D]/5" />
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left: 3D Portrait Frame */}
            <div className="lg:col-span-5 relative perspective-[1000px]">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                className="relative group"
              >
                {/* Parallax Background Shape */}
                <motion.div 
                  style={{ y: useTransform(scrollYProgress, [0.1, 0.4], [0, -50]) }}
                  className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#0EA5E9]/10 rounded-tr-[100px] -z-10 blur-2xl" 
                />
                
                <div className="relative z-10 overflow-hidden rounded-[2.5rem] shadow-2xl border-[6px] border-white translate-z-[50px] aspect-[4/5]">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    src={settings.about?.image_url}
                    alt="Sajith K Profile"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                  />
                </div>
              </motion.div>
            </div>

            {/* Right: Content Ecosystem */}
            <div className="lg:col-span-7 space-y-10">
              {/* Introduction */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3">
                  <span className="text-4xl text-[#0EA5E9] font-black leading-none">&quot;</span>
                  <h3 className="text-5xl font-black uppercase tracking-tighter text-[#2D2D2D]">
                    {settings.about?.title || 'HELLO'}<span className="text-[#0EA5E9]">.</span>
                  </h3>
                </div>
                <p className="text-base leading-relaxed text-[#2D2D2D]/60 max-w-xl">
                  {settings.about?.description || 'Visual storyteller creating captivating content through videography, photography, and creative editing.'}
                </p>
              </motion.div>

              {/* Skills & Software Grid */}
              <div className="grid md:grid-cols-2 gap-10 border-t border-[#2D2D2D]/5 pt-10">
                <div className="space-y-6">
                  <h4 className="font-black text-[10px] uppercase tracking-[0.4em] text-[#0EA5E9]">Expertise</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {(settings.expertise || [
                      { label: 'Videography', icon: 'Camera' },
                      { label: 'Photography', icon: 'Video' },
                      { label: 'Video Editing', icon: 'Film' },
                      { label: 'Color Grading', icon: 'Palette' }
                    ]).map((skill: any, i: number) => (
                      <motion.div 
                        key={i}
                        whileHover={{ x: 5 }}
                        className="flex items-center gap-3 group/skill cursor-default"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#2D2D2D]/5 flex items-center justify-center group-hover/skill:bg-[#0EA5E9] transition-colors">
                          <IconResolver name={skill.icon} size={12} className="text-[#2D2D2D]/40 group-hover/skill:text-white transition-colors" />
                        </div>
                        <span className="text-xs font-bold text-[#2D2D2D]/60 group-hover/skill:text-[#2D2D2D] transition-colors">{skill.label}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="font-black text-[10px] uppercase tracking-[0.4em] text-[#0EA5E9]">Tech Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {(settings.tech_stack || [
                      { name: 'PS', color: '#31A8FF' },
                      { name: 'LR', color: '#31A8FF' },
                      { name: 'AE', color: '#CF96FD' },
                      { name: 'PR', color: '#E48BFF' },
                      { name: 'CC', color: '#FF3C3C' },
                    ]).map((software: any, i: number) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.1, y: -2 }}
                        className="w-10 h-10 rounded-xl bg-[#2D2D2D] flex items-center justify-center text-[10px] font-black shadow-lg cursor-pointer"
                        style={{ color: software.color }}
                      >
                        {software.name}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Integration */}
              <div className="pt-10 border-t border-[#2D2D2D]/5 flex flex-wrap gap-x-12 gap-y-4">
                {[
                  { 
                    icon: Mail, 
                    value: settings.contact?.email || 'sajith@gmail.com', 
                    label: 'Email',
                    href: `mailto:${settings.contact?.email || 'sajith@gmail.com'}`
                  },
                  { 
                    icon: Instagram, 
                    value: settings.contact?.instagram || '@sajith.k', 
                    label: 'Social',
                    href: settings.contact?.instagram?.startsWith('http') 
                      ? settings.contact.instagram 
                      : `https://instagram.com/${(settings.contact?.instagram || 'sajith.k').replace('@', '')}`
                  },
                ].map((item) => (
                  <a 
                    key={item.label} 
                    href={item.href}
                    target={item.label === 'Social' ? "_blank" : undefined}
                    rel={item.label === 'Social' ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-3 group cursor-pointer"
                  >
                    <item.icon size={14} className="text-[#0EA5E9]" />
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black uppercase tracking-widest text-[#2D2D2D]/30">{item.label}</span>
                      <span className="text-xs font-bold text-[#2D2D2D] group-hover:text-[#0EA5E9] transition-colors">{item.value}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
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
