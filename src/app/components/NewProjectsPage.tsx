import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import RealisticBook from './RealisticBook';
import { supabase } from '../../lib/supabase';
import img1 from '../../imports/IMG_4770.JPG';
import img2 from '../../imports/IMG_4886.PNG';

const initialVideos = [
  { id: 1, title: 'Portfolio Reel 2026', thumbnail: img1 },
  { id: 2, title: 'Client Project Showcase', thumbnail: img2 },
];

function ScrollingBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-20">
      <motion.div 
        animate={{ 
          y: [0, -1000],
        }}
        transition={{ 
          duration: 40, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="flex flex-col gap-8 p-8"
      >
        {[...Array(10)].map((_, i) => (
          <div key={i} className="grid grid-cols-2 gap-8">
            <img src={img1} className="w-full aspect-video object-cover rounded-3xl blur-md" />
            <img src={img2} className="w-full aspect-video object-cover rounded-3xl blur-md" />
          </div>
        ))}
      </motion.div>
    </div>
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
    <div className="relative min-h-screen bg-[#E8E8E8] pt-24 pb-32 px-4 overflow-hidden">
      <ScrollingBackground />
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-4xl md:text-9xl font-black mb-4 tracking-tighter uppercase break-words">
            <span className="text-[#2D2D2D]">{settings.projects?.title?.split(' ')[0] || 'MY'} </span>
            <span className="text-[#0EA5E9]">{settings.projects?.title?.split(' ').slice(1).join(' ') || 'PROJECTS'}</span>
            <span className="text-[#0EA5E9]">.</span>
          </h1>
          <p className="text-xl text-[#2D2D2D]/70 font-medium uppercase tracking-[0.3em]">
            {settings.projects?.subtitle || 'Flip through my creative portfolio'}
          </p>
        </motion.div>

        {/* Projects Book Section */}
        <section className="mb-32">
          <RealisticBook />
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

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[2px] mt-10 px-0.5">
            {videos.map((video, idx) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setSelectedVideo(video.id)}
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: 5,
                  rotateX: -5,
                  translateZ: 30,
                  boxShadow: '0 30px 60px rgba(0,0,0,0.2)'
                }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {video.video_url ? (
                  <video
                    src={video.video_url}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-auto object-cover grayscale group-hover:grayscale-0 transition-all duration-700 brightness-75 group-hover:brightness-100"
                  />
                ) : (
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-auto object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                )}
                
                {/* Title Overlay on Hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4 text-center">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-white font-black text-sm uppercase tracking-tighter italic">{video.title}</h3>
                    <div className="w-8 h-8 bg-[#0EA5E9] rounded-full flex items-center justify-center mx-auto mt-2">
                      <Play size={12} className="text-white fill-white ml-0.5" />
                    </div>
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
              <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border-8 border-[#0EA5E9] relative">
                <div className="w-full h-full flex items-center justify-center text-white">
                  <div className="text-center">
                    <motion.div 
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Play className="w-24 h-24 mx-auto mb-6 text-[#0EA5E9]" />
                    </motion.div>
                    <p className="text-2xl md:text-4xl font-black italic tracking-tighter uppercase mb-2">Video Player</p>
                    <p className="text-sm md:text-xl opacity-50 font-medium tracking-widest uppercase">
                      {videos.find((v) => v.id === selectedVideo)?.title}
                    </p>
                  </div>
                </div>
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
