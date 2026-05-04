import { useRef, useState, forwardRef, useEffect } from 'react';
// @ts-ignore
import HTMLFlipBook from 'react-pageflip';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
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
            flippingTime={1000}
            usePortrait={isMobile}
            startZIndex={0}
            autoSize={true}
            maxShadowOpacity={0.5}
            showPageCorners={true}
            disableFlipByClick={false}
          >
          {/* Cover Page */}
          <Page>
            <div className="w-full h-full bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] p-12 flex flex-col items-center justify-center text-white relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
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
              <div className="w-full h-full p-8 flex flex-col">
                {/* Project Image */}
                <div className="relative overflow-hidden rounded-2xl mb-6 flex-1 shadow-inner bg-gray-100">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0EA5E9]/10 to-transparent z-10" />
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute top-4 right-4 bg-[#0EA5E9] text-white px-4 py-2 rounded-full text-sm font-black z-20 shadow-lg">
                    {project.category}
                  </div>
                </div>

                {/* Project Info */}
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-black text-[#2D2D2D] tracking-tight">
                      {project.title}
                    </h3>
                    <span className="text-xs text-[#0EA5E9] bg-[#0EA5E9]/10 px-3 py-1 rounded-full font-black uppercase tracking-wider">
                      {project.year}
                    </span>
                  </div>
                  <p className="text-[#2D2D2D]/70 leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </div>
            </Page>
          ))}

          {/* Back Cover */}
          <Page>
            <div className="w-full h-full bg-[#2D2D2D] p-12 flex flex-col items-center justify-center">
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

      {/* Navigation Controls */}
      <div className="flex items-center gap-6">
        <button
          onClick={prevPage}
          disabled={currentPage === 0}
          className="p-4 bg-[#0EA5E9] text-white rounded-full shadow-xl shadow-[#0EA5E9]/20 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#2D2D2D] transition-all hover:-translate-x-1"
        >
          <ChevronLeft size={28} />
        </button>

        <div className="text-center min-w-[120px]">
          <p className="text-sm font-black text-[#2D2D2D] uppercase tracking-widest">
            {currentPage + 1} / {projects.length + 2}
          </p>
        </div>

        <button
          onClick={nextPage}
          disabled={currentPage >= projects.length + 1}
          className="p-4 bg-[#0EA5E9] text-white rounded-full shadow-xl shadow-[#0EA5E9]/20 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#2D2D2D] transition-all hover:translate-x-1"
        >
          <ChevronRight size={28} />
        </button>
      </div>

      <p className="text-xs font-black text-[#2D2D2D]/40 mt-8 uppercase tracking-[0.2em]">
        Flip corners or use buttons
      </p>
    </div>
  );
}
