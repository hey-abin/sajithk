import { useRef, useState, forwardRef, useEffect } from 'react';
// @ts-ignore
import HTMLFlipBook from 'react-pageflip';
import { ChevronLeft, ChevronRight, Loader2, Maximize2, Minimize2, Volume2, VolumeX } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import img1 from '../../imports/IMG_4770.JPG';
import img2 from '../../imports/IMG_4886.PNG';

interface Project {
  id: string | number;
  title: string;
  category: string;
  description: string;
  image: string;
  year: string;
}

// Hardcoded initial data as fallback
const initialProjects: Project[] = [
  {
    id: 1,
    title: 'Cinematic Sunset',
    category: 'Photography',
    description: 'Capturing the golden hour with dramatic lighting and composition that brings warmth to every frame',
    image: img1,
    year: '2026',
  },
  {
    id: 2,
    title: 'Urban Aesthetics',
    category: 'Photography',
    description: 'Exploring modern architecture through creative perspectives and unique angles',
    image: img2,
    year: '2026',
  },
];

interface PageProps {
  children: React.ReactNode;
}

const Page = forwardRef<HTMLDivElement, PageProps>(({ children }, ref) => {
  return (
    <div ref={ref} className="page-content bg-white shadow-2xl">
      {children}
    </div>
  );
});

Page.displayName = 'Page';

export default function RealisticBook() {
  const bookRef = useRef<any>(null);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [bookSize, setBookSize] = useState({ width: 450, height: 600 });
  const [isMobile, setIsMobile] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('https://www.soundjay.com/misc/sounds/page-flip-01a.mp3');
  }, []);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (data && data.length > 0) {
      const formattedData = data.map(item => ({
        id: item.id,
        title: item.title,
        category: item.category,
        description: item.description,
        image: item.image_url,
        year: item.year
      }));
      setProjects(formattedData);
    }
    setLoading(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setIsMobile(true);
        setBookSize({ width: window.innerWidth - 32, height: (window.innerWidth - 32) * 1.3 });
      } else if (window.innerWidth < 1280) {
        setIsMobile(false);
        setBookSize({ width: 450, height: 600 });
      } else {
        setIsMobile(false);
        setBookSize({ width: 550, height: 750 });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextPage = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipNext();
    }
  };

  const prevPage = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipPrev();
    }
  };

  const onFlip = (e: any) => {
    setCurrentPage(e.data);
    if (!isMuted && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center py-12">
      {/* Book Container */}
      <div className="relative book-container mb-8">
        <div 
          className="book-flipbook"
          style={{
            transform: 'perspective(2000px) rotateX(5deg) rotateY(0deg)',
            transition: 'transform 0.5s ease-out',
            filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.2))'
          }}
        >
          <HTMLFlipBook
            ref={bookRef}
            width={bookSize.width}
            height={bookSize.height}
            size="stretch"
            minWidth={300}
            maxWidth={1000}
            minHeight={400}
            maxHeight={800}
            showCover={false}
            mobileScrollSupport={true}
            onFlip={onFlip}
            className="book-flipbook"
            style={{}}
            startPage={0}
            drawShadow={true}
            flippingTime={800}
            usePortrait={isMobile}
            startZIndex={0}
            autoSize={true}
            maxShadowOpacity={0.5}
            showPageCorners={true}
            disableFlipByClick={false}
          >
          {/* Cover Page */}
          <Page>
            <div className="w-full h-full bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] p-12 flex flex-col items-center justify-center text-white relative overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,0.3)]">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/leather.png')] opacity-30" />
              <div className="absolute top-0 bottom-0 right-0 w-4 bg-black/20 blur-sm z-20" /> {/* Spine shadow */}
              <div className="text-center relative z-10">
                <h1 className="text-6xl font-black mb-4 tracking-tighter">
                  SAJITH K
                </h1>
                <div className="w-24 h-1 bg-white/50 mx-auto mb-6" />
                <p className="text-2xl font-bold tracking-widest">
                  PORTFOLIO
                </p>
                <p className="text-xl opacity-70 mt-4">
                  2024 - 2026
                </p>
              </div>
              <div className="absolute bottom-8 text-sm opacity-50 uppercase tracking-widest">
                Click to flip pages
              </div>
            </div>
          </Page>

          {/* Project Pages */}
          {projects.map((project) => (
            <Page key={project.id}>
              <div className={`w-full h-full p-8 flex flex-col ${projects.indexOf(project) % 2 === 0 ? 'page-right' : 'page-left'}`}>
                {/* Project Image */}
                <div className="relative overflow-hidden rounded-2xl mb-6 flex-1 shadow-2xl group/img bg-gray-100">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0EA5E9]/20 to-transparent z-10 opacity-0 group-hover/img:opacity-100 transition-opacity" />
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover grayscale group-hover/img:grayscale-0 transition-all duration-1000 scale-110 group-hover/img:scale-100"
                  />
                  <div className="absolute top-4 right-4 bg-[#0EA5E9] text-white px-4 py-2 rounded-full text-sm font-black z-20 shadow-lg transform -rotate-3">
                    {project.category}
                  </div>
                </div>

                {/* Project Info */}
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-3xl font-black text-[#2D2D2D] tracking-tighter uppercase leading-none mb-1">
                        {project.title}
                      </h3>
                      <div className="h-1 w-12 bg-[#0EA5E9] rounded-full" />
                    </div>
                    <span className="text-xs text-white bg-[#2D2D2D] px-3 py-1 rounded-full font-black uppercase tracking-widest">
                      {project.year}
                    </span>
                  </div>
                  <p className="text-[#2D2D2D]/60 leading-relaxed font-medium text-sm">
                    {project.description}
                  </p>
                </div>
              </div>
            </Page>
          ))}

          {/* Back Cover */}
          <Page>
            <div className="w-full h-full bg-[#2D2D2D] p-12 flex flex-col items-center justify-center relative overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/leather.png')] opacity-30" />
              <div className="absolute top-0 bottom-0 left-0 w-4 bg-black/40 blur-sm z-20" /> {/* Spine shadow */}
              <div className="text-center text-white">
                <h2 className="text-4xl font-black mb-6 uppercase tracking-tighter">
                  Thank You
                </h2>
                <div className="w-24 h-1 bg-[#0EA5E9] mx-auto mb-8" />
                <p className="text-xl mb-6 opacity-80 italic">
                  Let's create something amazing together
                </p>
                <div className="space-y-3 text-lg font-medium text-white/70">
                  <p className="hover:text-[#0EA5E9] transition-colors">sajithkizhyapattu@gmail.com</p>
                  <p className="hover:text-[#0EA5E9] transition-colors">+91 9567633217</p>
                  <p className="hover:text-[#0EA5E9] transition-colors">@sajith.k</p>
                </div>
              </div>
            </div>
          </Page>
        </HTMLFlipBook>
      </div>
    </div>

      <div className="flex flex-col items-center gap-8">
        <div className="flex items-center gap-6">
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className="p-4 bg-white text-[#2D2D2D] rounded-full shadow-xl hover:bg-[#0EA5E9] hover:text-white transition-all hover:-translate-x-1 disabled:opacity-20"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#2D2D2D]/30 mb-1">Page</span>
            <div className="text-xl font-black text-[#2D2D2D]">
              {currentPage + 1} <span className="text-[#0EA5E9]/30 mx-1">/</span> {projects.length + 2}
            </div>
          </div>

          <button
            onClick={nextPage}
            disabled={currentPage >= projects.length + 1}
            className="p-4 bg-white text-[#2D2D2D] rounded-full shadow-xl hover:bg-[#0EA5E9] hover:text-white transition-all hover:translate-x-1 disabled:opacity-20"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-4 px-6 py-3 bg-white rounded-2xl shadow-lg border border-gray-100">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 text-[#2D2D2D]/40 hover:text-[#0EA5E9] transition-colors"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <div className="w-px h-4 bg-gray-100" />
          <button 
            onClick={toggleFullscreen}
            className="p-2 text-[#2D2D2D]/40 hover:text-[#0EA5E9] transition-colors"
            title="Fullscreen"
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>

        <p className="text-[10px] font-black text-[#2D2D2D]/20 uppercase tracking-[0.5em]">
          Interactive Flipbook Experience
        </p>
      </div>
    </div>
  );
}
