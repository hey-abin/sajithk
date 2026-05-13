import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../../lib/supabase';
import { Maximize2, X, ExternalLink, Calendar, Tag, Folder, Layers, ChevronLeft, ChevronRight } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  images?: string[];
  year: string;
  parent_id?: string;
}

export default function ProjectGallery() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
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
      {/* Navigation Header (Breadcrumbs) */}
      <AnimatePresence>
        {activeFolderId && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="sticky top-4 z-30 px-4 md:px-8"
          >
            <div className="max-w-fit mx-auto bg-white/70 backdrop-blur-xl py-3 px-6 rounded-2xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08)] flex items-center gap-x-3">
              <button 
                onClick={() => setActiveFolderId(null)}
                className="text-gray-400 hover:text-[#0EA5E9] transition-all font-black uppercase text-[9px] md:text-[10px] tracking-[0.2em] hover:scale-105 active:scale-95"
              >
                Projects
              </button>
              
              {(() => {
                const path = [];
                let currentId = activeFolderId;
                while (currentId) {
                  const p = projects.find(proj => proj.id === currentId);
                  if (p) {
                    path.unshift(p);
                    currentId = p.parent_id || null;
                  } else break;
                }
                return path.map((p, i) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <div className="w-1 h-1 bg-gray-200 rounded-full" />
                    <button 
                      onClick={() => setActiveFolderId(p.id)}
                      className={`font-black uppercase text-[9px] md:text-[10px] tracking-[0.2em] transition-all hover:scale-105 active:scale-95 ${i === path.length - 1 ? 'text-[#0EA5E9]' : 'text-gray-400 hover:text-[#0EA5E9]'}`}
                    >
                      {p.title}
                    </button>
                  </div>
                ));
              })()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {!activeFolderId ? (
          /* Main Projects Grid - Explorer Style */
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-8">
            {projects
              .filter(p => !p.parent_id)
              .map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setActiveFolderId(project.id)}
                className="group cursor-pointer flex flex-col items-center"
              >
                {/* Folder Icon / Card */}
                <div className="relative w-full aspect-square mb-4">
                  {/* Outer Glow */}
                  <div className="absolute inset-0 bg-[#0EA5E9]/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  {/* Folder Back Layer */}
                  <div className="absolute inset-0 bg-gray-50 rounded-[2rem] border-2 border-gray-100 translate-y-2 group-hover:translate-y-4 transition-transform duration-500 ease-out" />
                  
                  {/* Folder Tab Effect */}
                  <div className="absolute -top-2 left-6 w-1/3 h-6 bg-gray-100 rounded-t-xl group-hover:bg-[#0EA5E9] transition-colors duration-500" />
                  
                  {/* Main Folder Content (The Cover Image) */}
                  <div className="relative h-full w-full bg-white rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 group-hover:border-[#0EA5E9] group-hover:shadow-[0_20px_50px_rgba(14,165,233,0.1)] transition-all duration-500 ease-out flex items-center justify-center">
                    <img 
                      src={project.image_url} 
                      alt={project.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    
                    {/* Items Badge */}
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-sm border border-white/20">
                      <Layers size={12} className="text-[#0EA5E9]" />
                      <span className="text-[10px] font-black text-[#2D2D2D] uppercase tracking-wider">
                        {project.images?.length || 1}
                      </span>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>

                {/* Folder Labels */}
                <div className="text-center w-full px-2">
                  <h3 className="font-black text-[11px] md:text-sm uppercase tracking-[0.15em] text-[#2D2D2D] group-hover:text-[#0EA5E9] transition-all duration-300 truncate">
                    {project.title}
                  </h3>
                  <div className="w-4 h-[1px] bg-gray-200 mx-auto my-1.5 group-hover:w-8 group-hover:bg-[#0EA5E9] transition-all duration-300" />
                  <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{project.year}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Inside Folder View - Content Grid */
          <div className="space-y-16">
            {/* Sub-Folders within this folder */}
            {projects.filter(p => p.parent_id === activeFolderId).length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-8">
                {projects
                  .filter(p => p.parent_id === activeFolderId)
                  .map((project, idx) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => setActiveFolderId(project.id)}
                      className="group cursor-pointer flex flex-col items-center"
                    >
                      <div className="relative w-full aspect-square mb-4">
                        <div className="absolute inset-0 bg-[#0EA5E9]/5 rounded-[2rem] border-2 border-[#0EA5E9]/10 translate-y-2 group-hover:translate-y-4 transition-transform duration-500" />
                        <div className="absolute -top-2 left-6 w-1/3 h-6 bg-gray-100 rounded-t-xl group-hover:bg-[#0EA5E9] transition-colors duration-500" />
                        <div className="relative h-full w-full bg-white rounded-[2rem] overflow-hidden shadow-2xl shadow-black/5 border border-gray-100 group-hover:border-[#0EA5E9] transition-all duration-500 flex items-center justify-center">
                          <img src={project.image_url} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                            <Layers size={10} className="text-[#0EA5E9]" />
                            <span className="text-[9px] font-black text-[#2D2D2D] uppercase tracking-tighter">{project.images?.length || 0}</span>
                          </div>
                        </div>
                      </div>
                      <h3 className="text-sm font-black uppercase tracking-tight text-[#2D2D2D] group-hover:text-[#0EA5E9] transition-colors">{project.title}</h3>
                    </motion.div>
                  ))}
              </div>
            )}

            <div className="columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-3 space-y-3">
              {projects.find(p => p.id === activeFolderId)?.images?.map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => {
                    setSelectedProject(projects.find(p => p.id === activeFolderId) || null);
                    setSelectedImageIndex(i);
                  }}
                  className="relative rounded-2xl md:rounded-3xl overflow-hidden cursor-zoom-in group shadow-xl hover:shadow-2xl transition-all break-inside-avoid mb-4"
                >
                  <img src={img} className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                      <Maximize2 size={14} className="text-white" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Folder Footer / Story */}
            <div className="max-w-3xl mx-auto text-center space-y-6 py-20 border-t border-gray-100">
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Project Story</span>
               <p className="text-xl md:text-2xl font-medium text-[#2D2D2D]/80 leading-relaxed italic">
                 "{projects.find(p => p.id === activeFolderId)?.description}"
               </p>
               <button 
                 onClick={() => setActiveFolderId(null)}
                 className="mt-10 px-10 py-4 bg-[#2D2D2D] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-[#0EA5E9] transition-all shadow-xl shadow-black/10"
               >
                 Close Folder
               </button>
            </div>
          </div>
        )}
      </div>

      {/* Image Expansion Lightbox */}
      <AnimatePresence>
        {selectedImageIndex !== null && selectedProject && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImageIndex(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-xl"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-[95vw] max-h-[90vh] z-10"
            >
              <img 
                src={(selectedProject.images && selectedProject.images.length > 0 ? selectedProject.images : [selectedProject.image_url])[selectedImageIndex]} 
                className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-[0_0_100px_rgba(0,0,0,0.5)]"
              />
              
              <button 
                onClick={() => setSelectedImageIndex(null)}
                className="absolute -top-4 -right-4 md:-right-12 text-white bg-[#0EA5E9] hover:bg-[#2D2D2D] transition-all p-3 rounded-full shadow-2xl z-[210] group"
              >
                <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>

              {/* Navigation */}
              {(selectedProject.images?.length || 0) > 1 && (
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 pointer-events-none">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImageIndex(prev => (prev! > 0 ? prev! - 1 : selectedProject.images!.length - 1));
                    }}
                    className="p-5 bg-black/50 hover:bg-[#0EA5E9] text-white rounded-full backdrop-blur-xl transition-all pointer-events-auto border border-white/20 shadow-2xl group"
                  >
                    <ChevronLeft size={28} className="group-hover:-translate-x-1 transition-transform" />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImageIndex(prev => (prev! < selectedProject.images!.length - 1 ? prev! + 1 : 0));
                    }}
                    className="p-5 bg-black/50 hover:bg-[#0EA5E9] text-white rounded-full backdrop-blur-xl transition-all pointer-events-auto border border-white/20 shadow-2xl group"
                  >
                    <ChevronRight size={28} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
