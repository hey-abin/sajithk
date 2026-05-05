import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../../lib/supabase';
import { Maximize2, X, ExternalLink, Calendar, Tag } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image_url: string;
  year: string;
}

export default function ProjectGallery() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (data) setProjects(data);
    setLoading(false);
  };

  return (
    <div className="w-full">
      {/* Project Grid */}
      <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-2 md:gap-4 space-y-2 md:space-y-4">
        <AnimatePresence mode='popLayout'>
          {projects.map((project, idx) => (
            <motion.div
              layout
              key={project.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              whileHover={{ y: -5 }}
              onClick={() => setSelectedProject(project)}
              className="relative rounded-xl md:rounded-2xl overflow-hidden bg-white shadow-2xl shadow-black/5 cursor-pointer break-inside-avoid mb-2 md:mb-4 group"
            >
              <div className="relative overflow-hidden">
                <img 
                  src={project.image_url} 
                  alt={project.title} 
                  className="w-full h-auto transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4 md:p-6">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="text-[#0EA5E9] font-black text-[8px] md:text-[10px] uppercase tracking-[0.3em] mb-1 block">
                      {project.category}
                    </span>
                    <h3 className="text-white text-sm md:text-xl font-black uppercase tracking-tighter leading-tight mb-1">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-2 text-white/50 text-[8px] font-bold uppercase tracking-widest">
                      <Maximize2 size={10} /> View Project
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Project Lightbox */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-[#2D2D2D]/95 backdrop-blur-xl"
            />
            
            <motion.div
              layoutId={selectedProject.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-[92%] md:w-full max-w-6xl bg-white rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl flex flex-col lg:grid lg:grid-cols-12 max-h-[85vh] md:max-h-[90vh]"
            >
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 z-50 p-3 bg-white/20 hover:bg-white text-white hover:text-[#2D2D2D] rounded-full backdrop-blur-md transition-all"
              >
                <X size={24} />
              </button>

              <div className="lg:col-span-7 bg-[#F3F3F5] overflow-hidden flex items-center justify-center">
                <img 
                  src={selectedProject.image_url} 
                  alt={selectedProject.title} 
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="lg:col-span-5 p-6 md:p-12 flex flex-col justify-between bg-white overflow-y-auto">
                <div className="space-y-6 md:space-y-8">
                  <div>
                    <div className="flex items-center gap-3 text-[#0EA5E9] mb-3 md:mb-4">
                      <div className="w-8 h-px bg-[#0EA5E9]" />
                      <span className="font-black text-[10px] md:text-xs uppercase tracking-[0.4em]">{selectedProject.category}</span>
                    </div>
                    <h2 className="text-3xl md:text-6xl font-black uppercase tracking-tighter text-[#2D2D2D] leading-[0.9] mb-4 md:mb-6">
                      {selectedProject.title.split(' ').map((word, i) => (
                        <span key={i} className="block">{word}</span>
                      ))}
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 gap-4 md:gap-8 border-y border-gray-100 py-6 md:py-8">
                    <div className="space-y-1">
                      <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Year</span>
                      <p className="font-black text-sm md:text-base text-[#2D2D2D]">{selectedProject.year}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Service</span>
                      <p className="font-black text-sm md:text-base text-[#2D2D2D]">{selectedProject.category}</p>
                    </div>
                  </div>

                  <div className="space-y-3 md:space-y-4">
                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">The Story</span>
                    <p className="text-[#2D2D2D]/60 text-xs md:text-base leading-relaxed font-medium">
                      {selectedProject.description}
                    </p>
                  </div>
                </div>

                <div className="pt-8 md:pt-12">
                  <button 
                    onClick={() => setSelectedProject(null)}
                    className="w-full py-4 md:py-5 bg-[#2D2D2D] text-white rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-[#0EA5E9] transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3"
                  >
                    Close Project <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
