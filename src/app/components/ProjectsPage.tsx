import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import img1 from '../../imports/IMG_4770.JPG';
import img2 from '../../imports/IMG_4886.PNG';

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  year: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: 'Cinematic Sunset',
    category: 'Photography',
    description: 'Capturing the golden hour with dramatic lighting and composition',
    image: img1,
    year: '2026',
  },
  {
    id: 2,
    title: 'Urban Aesthetics',
    category: 'Photography',
    description: 'Exploring modern architecture through creative perspectives',
    image: img2,
    year: '2026',
  },
  {
    id: 3,
    title: 'Motion Story',
    category: 'Videography',
    description: 'A visual journey through dynamic storytelling',
    image: img1,
    year: '2025',
  },
  {
    id: 4,
    title: 'Color Grading Mastery',
    category: 'Post Production',
    description: 'Professional color correction and grading showcase',
    image: img2,
    year: '2025',
  },
  {
    id: 5,
    title: 'Nature Chronicles',
    category: 'Photography',
    description: 'Documenting the beauty of natural landscapes',
    image: img1,
    year: '2024',
  },
  {
    id: 6,
    title: 'Creative Reels',
    category: 'Social Media',
    description: 'Engaging short-form content with modern editing',
    image: img2,
    year: '2024',
  },
];

const sampleVideos = [
  { id: 1, title: 'Portfolio Reel 2026', thumbnail: img1 },
  { id: 2, title: 'Client Project Showcase', thumbnail: img2 },
  { id: 3, title: 'Behind the Scenes', thumbnail: img1 },
  { id: 4, title: 'Creative Experiments', thumbnail: img2 },
  { id: 5, title: 'Travel Montage', thumbnail: img1 },
  { id: 6, title: 'Product Videography', thumbnail: img2 },
];

export default function ProjectsPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const itemsPerPage = 2;
  const totalPages = Math.ceil(projects.length / itemsPerPage);

  const handlePageTurn = (direction: 'next' | 'prev') => {
    if (isFlipping) return;

    setIsFlipping(true);
    if (direction === 'next' && currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }

    setTimeout(() => setIsFlipping(false), 600);
  };

  const currentProjects = projects.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Projects Book Section */}
        <section className="mb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-bold mb-4">Projects</h1>
            <p className="text-xl text-black/70">Flip through my creative portfolio</p>
          </motion.div>

          {/* 3D Book Container */}
          <div className="relative max-w-5xl mx-auto perspective-1000">
            <div className="relative bg-gradient-to-br from-white to-sky-blue/5 rounded-3xl shadow-2xl p-8 md:p-12 min-h-[600px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial={{ rotateY: currentPage > 0 ? -90 : 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: currentPage > 0 ? 90 : -90, opacity: 0 }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                  className="grid md:grid-cols-2 gap-8"
                >
                  {currentProjects.map((project, idx) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.2 }}
                      className="group cursor-pointer"
                    >
                      <div className="relative overflow-hidden rounded-2xl shadow-lg mb-4 aspect-[4/3]">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <p className="text-sm mb-1">{project.category}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <h3 className="text-2xl font-semibold">{project.title}</h3>
                          <span className="text-sm text-black/50">{project.year}</span>
                        </div>
                        <p className="text-black/60">{project.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-4">
                <button
                  onClick={() => handlePageTurn('prev')}
                  disabled={currentPage === 0 || isFlipping}
                  className="p-3 bg-white rounded-full shadow-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-sky-blue hover:text-white transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === currentPage ? 'bg-sky-blue w-8' : 'bg-black/20'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => handlePageTurn('next')}
                  disabled={currentPage === totalPages - 1 || isFlipping}
                  className="p-3 bg-white rounded-full shadow-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-sky-blue hover:text-white transition-colors"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>

            {/* Book Shadow */}
            <div className="absolute -bottom-4 left-8 right-8 h-8 bg-black/10 blur-2xl rounded-full" />
          </div>
        </section>

        {/* Video Gallery Section */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Video Showcase</h2>
            <p className="text-xl text-black/70">Explore my videography work</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleVideos.map((video, idx) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setSelectedVideo(video.id)}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-xl shadow-lg aspect-video bg-black">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-70 transition-opacity"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      className="w-16 h-16 bg-sky-blue rounded-full flex items-center justify-center shadow-2xl"
                    >
                      <Play className="w-8 h-8 text-white ml-1" fill="white" />
                    </motion.div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <h3 className="text-white font-semibold">{video.title}</h3>
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
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl"
            >
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute -top-12 right-0 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={32} />
              </button>

              <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
                <div className="w-full h-full flex items-center justify-center text-white">
                  <div className="text-center">
                    <Play className="w-20 h-20 mx-auto mb-4 opacity-50" />
                    <p className="text-xl opacity-70">Video Player Placeholder</p>
                    <p className="text-sm opacity-50 mt-2">
                      {sampleVideos.find(v => v.id === selectedVideo)?.title}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const currentIdx = sampleVideos.findIndex(v => v.id === selectedVideo);
                  if (currentIdx > 0) setSelectedVideo(sampleVideos[currentIdx - 1].id);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <ChevronLeft className="text-white" size={32} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const currentIdx = sampleVideos.findIndex(v => v.id === selectedVideo);
                  if (currentIdx < sampleVideos.length - 1) setSelectedVideo(sampleVideos[currentIdx + 1].id);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <ChevronRight className="text-white" size={32} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
