import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import RealisticBook from './RealisticBook';
import ProjectGallery from './ProjectGallery';
import { supabase } from '../../lib/supabase';
import img1 from '../../imports/IMG_4770.JPG';
import img2 from '../../imports/IMG_4886.PNG';

const initialVideos = [
  { id: 1, title: 'Portfolio Reel 2026', thumbnail: img1 },
  { id: 2, title: 'Client Project Showcase', thumbnail: img2 },
];

function CinematicBackground() {
  return (
    <>
      {/* Cinematic Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] mix-blend-overlay">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ 
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[15%] w-[40vw] h-[40vw] bg-[#0EA5E9]/5 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            x: [0, -40, 0],
            y: [0, -20, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[10%] right-[10%] w-[35vw] h-[35vw] bg-[#0EA5E9]/8 rounded-full blur-[100px]" 
        />
      </div>
    </>
  );
}

export default function NewProjectsPage() {
  const [selectedVideo, setSelectedVideo] = useState<number | string | null>(null);
  const [videos, setVideos] = useState<any[]>(initialVideos);
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: vidData } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
    const { data: settsData } = await supabase.from('site_settings').select('*');
    
    if (vidData && vidData.length > 0) {
      setVideos(vidData.map(v => ({
        id: v.id,
        title: v.title,
        thumbnail: v.thumbnail_url,
        video_url: v.video_url
      })));
    }

    if (settsData) {
      const settsMap: any = {};
      settsData.forEach(s => { settsMap[s.key] = s.value; });
      setSettings(settsMap);
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen bg-[#F3F3F5] pt-24 pb-32 px-4 overflow-hidden selection:bg-[#0EA5E9] selection:text-white">
      <CinematicBackground />
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 relative"
        >
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-8 bg-[#2D2D2D]/10" />
            <span className="font-black text-[10px] tracking-[0.4em] uppercase text-[#2D2D2D]/30 italic">
              {settings.projects?.subtitle || 'Flip through my creative portfolio'}
            </span>
            <div className="h-px w-8 bg-[#2D2D2D]/10" />
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-4 tracking-tighter uppercase leading-[0.85] py-2">
            <span className="text-[#2D2D2D] block md:inline">{settings.projects?.title?.split(' ')[0] || 'MY'} </span>
            <span className="text-[#0EA5E9] block md:inline">{settings.projects?.title?.split(' ').slice(1).join(' ') || 'PROJECTS'}</span>
            <span className="text-[#0EA5E9]">.</span>
          </h1>
        </motion.div>

        {/* Projects Grid Section */}
        <section className="mb-32">
          <ProjectGallery />
        </section>

        {/* Video Gallery */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
          <h2 className="text-4xl md:text-8xl font-black mb-4 tracking-tighter uppercase break-words">
            <span className="text-[#2D2D2D]">{settings.videos?.title?.split(' ')[0] || 'VIDEO'} </span>
            <span className="text-[#0EA5E9]">{settings.videos?.title?.split(' ').slice(1).join(' ') || 'SHOWCASE'}</span>
            <span className="text-[#0EA5E9]">.</span>
          </h2>
          <p className="text-xl text-[#2D2D2D]/70 font-medium uppercase tracking-[0.3em]">
            {settings.videos?.subtitle || 'Explore my videography work'}
          </p>
          </motion.div>

          <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-2 md:gap-4 space-y-2 md:space-y-4 mt-10 px-0.5">
            {videos.map((video, idx) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setSelectedVideo(video.id)}
                className="relative rounded-xl md:rounded-2xl overflow-hidden bg-black shadow-2xl transition-all duration-500 hover:scale-[1.02] break-inside-avoid mb-2 md:mb-4"
              >
                <video
                  src={video.video_url}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-auto group-hover:scale-105 transition-all duration-1000 brightness-75 group-hover:brightness-100 block"
                />
                
                {/* Info Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-3 md:p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <span className="text-[#0EA5E9] font-black text-[8px] md:text-[10px] uppercase tracking-[0.3em] mb-0.5 md:mb-1 block">Video Work</span>
                  <h3 className="text-white font-black text-xs md:text-xl uppercase tracking-tighter italic leading-tight">{video.title}</h3>
                </div>

                <div className="absolute top-3 right-3 md:top-6 md:right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                    <Play size={12} className="text-white fill-white ml-0.5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedVideo(null)}
            className="fixed inset-0 bg-[#2D2D2D]/95 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute -top-16 right-0 p-3 text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={32} />
              </button>

              {/* Video Container */}
              <div className="relative bg-black rounded-3xl overflow-hidden shadow-2xl border-8 border-[#0EA5E9] max-h-[85vh] w-auto mx-auto flex items-center justify-center">
                <video
                  src={videos.find((v) => v.id === selectedVideo)?.video_url}
                  controls
                  autoPlay
                  className="max-w-full max-h-[80vh] w-auto h-auto"
                />
              </div>

              {/* Navigation */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const currentIdx = videos.findIndex((v) => v.id === selectedVideo);
                  if (currentIdx > 0) setSelectedVideo(videos[currentIdx - 1].id);
                }}
                className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 p-3 md:p-6 bg-white text-[#2D2D2D] hover:bg-[#0EA5E9] hover:text-white rounded-full transition-all shadow-2xl group"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const currentIdx = videos.findIndex((v) => v.id === selectedVideo);
                  if (currentIdx < videos.length - 1)
                    setSelectedVideo(videos[currentIdx + 1].id);
                }}
                className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 p-3 md:p-6 bg-white text-[#2D2D2D] hover:bg-[#0EA5E9] hover:text-white rounded-full transition-all shadow-2xl group"
              >
                <ChevronRight size={24} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
