import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Edit2, LogOut, Image as ImageIcon, Video as VideoIcon, Save, X, ChevronRight, ChevronLeft, Menu, Folder } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Project {
  id?: string;
  title: string;
  description: string;
  image_url: string;
  images?: string[];
  year: string;
  parent_id?: string;
}

interface Video {
  id?: string;
  title: string;
  thumbnail_url: string;
  video_url: string;
}

export default function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<'projects' | 'videos' | 'settings'>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [openedFolderId, setOpenedFolderId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [formData, setFormData] = useState<any>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: projData, error: projError } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (projError) console.error('Projects Error:', projError);
      
      const { data: vidData, error: vidError } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
      if (vidError) console.error('Videos Error:', vidError);

      const { data: settsData, error: settsError } = await supabase.from('site_settings').select('*');
      if (settsError) console.error('Settings Error:', settsError);
      
      if (projData) setProjects(projData);
      if (vidData) setVideos(vidData);
      
      if (settsData) {
        const settsMap: any = {};
        settsData.forEach(s => { settsMap[s.key] = s.value; });
        setSettings(settsMap);
      }
    } catch (err) {
      console.error('Fetch Error:', err);
    }
    setLoading(false);
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('sajith')
      .upload(filePath, file);

    if (uploadError) {
      alert('Error uploading file: ' + uploadError.message);
      setUploading(false);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('sajith')
      .getPublicUrl(filePath);

    setUploading(false);
    return publicUrl;
  };

  const handleSave = async (type: 'projects' | 'videos') => {
    const table = type as any;
    const { error } = editingId === 'new' 
      ? await supabase.from(table).insert([formData])
      : await supabase.from(table).update(formData).eq('id', editingId);

    if (error) {
      console.error('Save error:', error);
      alert(`Error saving ${type}: ${error.message}\n\nMake sure you have added the 'parent_id' column to your database if you are creating sub-folders.`);
    } else {
      fetchData();
      setEditingId(null);
      setFormData({});
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    for (const key of Object.keys(settings)) {
      await supabase.from('site_settings').upsert({ key, value: settings[key] });
    }
    fetchData();
    alert('Settings saved!');
  };

  const seedDatabase = async () => {
    if (!confirm('This will populate the database with initial content. Continue?')) return;
    setLoading(true);
    const initialSetts = [
      { key: 'hero', value: { title: 'PORTO', subtitle: 'FOLIO', tagline: 'Creative Visual', image_url: 'https://pihhtsvshfllrxonagim.supabase.co/storage/v1/object/public/sajith/hero_profile.jpg' } },
      { key: 'about', value: { title: 'HELLO', description: 'Visual storyteller creating captivating content through videography, photography, and creative editing.', image_url: 'https://pihhtsvshfllrxonagim.supabase.co/storage/v1/object/public/sajith/hero_about.png' } },
      { key: 'contact', value: { name: 'SAJITH K', email: 'sajithkizhyapattu@gmail.com', phone: '+91 9567633217', instagram: '@sajith.k', youtube: 'https://youtube.com' } },
      { key: 'expertise', value: [
        { label: 'Videography', icon: 'Camera' },
        { label: 'Photography', icon: 'Video' },
        { label: 'Video Editing', icon: 'Film' },
        { label: 'Color Grading', icon: 'Palette' }
      ]},
      { key: 'tech_stack', value: [
        { name: 'PS', color: '#31A8FF' },
        { name: 'LR', color: '#31A8FF' },
        { name: 'AE', color: '#CF96FD' },
        { name: 'PR', color: '#E48BFF' },
        { name: 'CC', color: '#FF3C3C' }
      ]}
    ];

    for (const s of initialSetts) {
      await supabase.from('site_settings').upsert(s);
    }
    fetchData();
    alert('Database seeded successfully!');
  };

  const handleDelete = async (type: 'projects' | 'videos', id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      const table = type as any;
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (!error) fetchData();
    }
  };

  const startEditing = (item: any) => {
    setEditingId(item.id);
    setFormData(item);
  };

  const startNew = () => {
    setEditingId('new');
    if (activeTab === 'projects') {
      setFormData({ title: '', description: '', image_url: '', images: [], year: new Date().getFullYear().toString() });
    } else {
      setFormData({ title: '', thumbnail_url: '', video_url: '' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F3F5] text-[#2D2D2D]">
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-3 bg-[#0EA5E9] text-white rounded-xl shadow-lg"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 p-6 z-40 transition-transform duration-300 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="flex items-center gap-3 mb-12">
          <div className="w-8 h-8 bg-[#0EA5E9] rounded-lg shadow-lg shadow-[#0EA5E9]/20" />
          <h1 className="font-black text-xl tracking-tighter">ADMIN</h1>
        </div>

        <nav className="space-y-2">
          {[
            { id: 'projects', icon: ImageIcon, label: 'Projects' },
            { id: 'videos', icon: VideoIcon, label: 'Videos' },
            { id: 'settings', icon: Save, label: 'Site Content' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as any);
                setOpenedFolderId(null);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                activeTab === item.id ? 'bg-[#0EA5E9] text-white shadow-lg shadow-[#0EA5E9]/20' : 'hover:bg-gray-100'
              }`}
            >
              <item.icon size={20} /> {item.label}
            </button>
          ))}
        </nav>

        <button
          onClick={onLogout}
          className="absolute bottom-8 left-6 right-6 flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="md:ml-64 p-6 md:p-10 pt-20 md:pt-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mb-1">
              <h2 
                className={`text-xl md:text-2xl font-black tracking-tighter uppercase cursor-pointer hover:text-[#0EA5E9] transition-colors ${openedFolderId ? 'text-gray-400' : 'text-[#2D2D2D]'}`}
                onClick={() => setOpenedFolderId(null)}
              >
                {activeTab === 'settings' ? 'Site Content' : activeTab}
              </h2>
              
              {openedFolderId && (() => {
                const path = [];
                let currentId = openedFolderId;
                while (currentId) {
                  const p = projects.find(proj => proj.id === currentId);
                  if (p) {
                    path.unshift(p);
                    currentId = (p as any).parent_id;
                  } else break;
                }
                return path.map((p, i) => (
                  <div key={p.id} className="flex items-center gap-2">
                    <ChevronRight className="text-gray-300" size={16} />
                    <h2 
                      className={`text-xl md:text-2xl font-black tracking-tighter uppercase cursor-pointer transition-colors ${i === path.length - 1 ? 'text-[#0EA5E9]' : 'text-gray-400 hover:text-[#0EA5E9]'}`}
                      onClick={() => setOpenedFolderId(p.id!)}
                    >
                      {p.title}
                    </h2>
                  </div>
                ));
              })()}
            </div>
            <p className="text-gray-500 font-medium text-xs md:text-sm">
              {openedFolderId 
                ? `Managing content inside this folder` 
                : `Manage your ${activeTab === 'settings' ? 'website text and info' : `${activeTab} content`}`}
            </p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            {openedFolderId && (
              <button
                onClick={() => {
                  const proj = projects.find(p => p.id === openedFolderId);
                  if (proj) startEditing(proj);
                }}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white text-[#2D2D2D] rounded-lg font-black uppercase tracking-widest text-[9px] shadow-sm hover:bg-gray-50 transition-all border border-gray-100"
              >
                <Edit2 size={12} /> Details
              </button>
            )}
            {activeTab !== 'settings' && (
              <div className="flex gap-2 flex-1 md:flex-none">
                {openedFolderId && (
                  <button
                    onClick={() => {
                      setEditingId('new');
                      setFormData({ 
                        title: '', 
                        description: '', 
                        image_url: '', 
                        images: [], 
                        year: new Date().getFullYear().toString(),
                        parent_id: openedFolderId 
                      });
                    }}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#F3F3F5] text-[#2D2D2D] rounded-lg font-black uppercase tracking-widest text-[9px] border border-gray-200 hover:bg-white transition-all"
                  >
                    <Folder className="text-[#0EA5E9]" size={12} /> New Folder
                  </button>
                )}
                <button
                  onClick={openedFolderId ? () => {} : startNew}
                  className="relative flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#0EA5E9] text-white rounded-lg font-black uppercase tracking-widest text-[9px] shadow-lg shadow-[#0EA5E9]/20 hover:bg-[#2D2D2D] transition-all overflow-hidden"
                >
                  {openedFolderId ? (
                    <>
                      <Plus size={12} /> Add Images
                      <input
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        accept="image/*"
                        multiple
                        onChange={async (e) => {
                          if (e.target.files && openedFolderId) {
                            const files = Array.from(e.target.files);
                            setUploadProgress({ current: 0, total: files.length });
                            setUploading(true);
                            
                            const proj = projects.find(p => p.id === openedFolderId);
                            if (!proj) return;
                            
                            const newUrls = [];
                            for (let i = 0; i < files.length; i++) {
                              const url = await handleFileUpload(files[i]);
                              if (url) {
                                newUrls.push(url);
                                setUploadProgress(prev => ({ ...prev, current: i + 1 }));
                              }
                            }
                            const updatedImages = [...(proj.images || []), ...newUrls];
                            const { error } = await supabase.from('projects').update({ 
                              images: updatedImages,
                              image_url: updatedImages[0] || proj.image_url
                            }).eq('id', openedFolderId);
                            
                            if (!error) fetchData();
                            setUploading(false);
                            setUploadProgress({ current: 0, total: 0 });
                          }
                        }}
                      />
                    </>
                  ) : (
                    <><Plus size={12} /> Add New</>
                  )}
                </button>
              </div>
            )}
          </div>
        </header>

        {uploading && uploadProgress.total > 0 && (
          <div className="fixed top-0 left-0 right-0 z-[100] h-1.5 bg-gray-100 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
              className="h-full bg-[#0EA5E9] shadow-[0_0_10px_#0EA5E9]"
            />
            <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md px-6 py-2 rounded-full shadow-2xl border border-white/20 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3">
              <div className="w-2 h-2 bg-[#0EA5E9] rounded-full animate-ping" />
              Uploading {uploadProgress.current} / {uploadProgress.total} Images
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-[#0EA5E9] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : activeTab === 'settings' ? (
          <div className="max-w-4xl space-y-12">
            <section className="bg-white p-8 rounded-[2rem] shadow-xl shadow-black/5 border-2 border-dashed border-[#0EA5E9]/20">
              <h3 className="text-xl font-bold mb-2 uppercase tracking-tighter">First Time Setup?</h3>
              <p className="text-gray-500 mb-6 font-medium">If your database is empty, click below to populate it with the default portfolio content.</p>
              <button
                onClick={seedDatabase}
                className="px-8 py-4 bg-[#0EA5E9] text-white rounded-xl font-black uppercase tracking-widest hover:bg-[#2D2D2D] transition-all shadow-lg shadow-[#0EA5E9]/20"
              >
                Seed Initial Content
              </button>
            </section>

            <section className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl shadow-black/5">
              <h3 className="text-2xl font-black mb-6 uppercase tracking-tight">Hero Section</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <Input label="Main Title" value={settings.hero?.title} onChange={(v: string) => setSettings({...settings, hero: {...settings.hero, title: v}})} />
                  <Input label="Subtitle" value={settings.hero?.subtitle} onChange={(v: string) => setSettings({...settings, hero: {...settings.hero, subtitle: v}})} />
                  <Input label="Tagline" value={settings.hero?.tagline} onChange={(v: string) => setSettings({...settings, hero: {...settings.hero, tagline: v}})} />
                </div>
                <div className="space-y-4">
                  <div className="aspect-video rounded-3xl overflow-hidden bg-gray-100 border-2 border-dashed border-gray-200 flex items-center justify-center relative group">
                    {settings.hero?.image_url ? (
                      <img src={settings.hero.image_url} alt="Hero Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="text-gray-300" size={48} />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <label className="px-4 py-2 bg-white text-[#2D2D2D] rounded-full font-bold text-xs cursor-pointer hover:bg-[#0EA5E9] hover:text-white transition-all">
                        {uploading ? 'Uploading...' : 'Change Image'}
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={async (e) => {
                            if (e.target.files?.[0]) {
                              const url = await handleFileUpload(e.target.files[0]);
                              if (url) setSettings({...settings, hero: {...settings.hero, image_url: url}});
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                  <Input label="Hero Image URL" value={settings.hero?.image_url} onChange={(v: string) => setSettings({...settings, hero: {...settings.hero, image_url: v}})} />
                </div>
              </div>
            </section>

            <section className="bg-white p-8 rounded-[2rem] shadow-xl shadow-black/5">
              <h3 className="text-2xl font-black mb-6 uppercase tracking-tight">Projects Page</h3>
              <div className="space-y-6">
                <Input label="Page Title" value={settings.projects?.title} onChange={(v: string) => setSettings({...settings, projects: {...settings.projects, title: v}})} />
                <Input label="Page Subtitle" value={settings.projects?.subtitle} onChange={(v: string) => setSettings({...settings, projects: {...settings.projects, subtitle: v}})} />
              </div>
            </section>

            <section className="bg-white p-8 rounded-[2rem] shadow-xl shadow-black/5">
              <h3 className="text-2xl font-black mb-6 uppercase tracking-tight">Videos Page</h3>
              <div className="space-y-6">
                <Input label="Page Title" value={settings.videos?.title} onChange={(v: string) => setSettings({...settings, videos: {...settings.videos, title: v}})} />
                <Input label="Page Subtitle" value={settings.videos?.subtitle} onChange={(v: string) => setSettings({...settings, videos: {...settings.videos, subtitle: v}})} />
              </div>
            </section>

            <section className="bg-white p-8 rounded-[2rem] shadow-xl shadow-black/5">
              <h3 className="text-2xl font-black mb-6 uppercase tracking-tight">About Section</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <Input label="Title" value={settings.about?.title} onChange={(v: string) => setSettings({...settings, about: {...settings.about, title: v}})} />
                  <Input label="Description" value={settings.about?.description} onChange={(v: string) => setSettings({...settings, about: {...settings.about, description: v}})} textarea />
                </div>
                <div className="space-y-4">
                  <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-gray-100 border-2 border-dashed border-gray-200 flex items-center justify-center relative group">
                    {settings.about?.image_url ? (
                      <img src={settings.about.image_url} alt="About Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="text-gray-300" size={48} />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <label className="px-4 py-2 bg-white text-[#2D2D2D] rounded-full font-bold text-xs cursor-pointer hover:bg-[#0EA5E9] hover:text-white transition-all">
                        {uploading ? 'Uploading...' : 'Change Image'}
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={async (e) => {
                            if (e.target.files?.[0]) {
                              const url = await handleFileUpload(e.target.files[0]);
                              if (url) setSettings({...settings, about: {...settings.about, image_url: url}});
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                  <Input label="About Image URL" value={settings.about?.image_url} onChange={(v: string) => setSettings({...settings, about: {...settings.about, image_url: v}})} />
                </div>
              </div>
            </section>

            <section className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl shadow-black/5">
              <h3 className="text-2xl font-black mb-6 uppercase tracking-tight">Contact Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Email" value={settings.contact?.email} onChange={(v: string) => setSettings({...settings, contact: {...settings.contact, email: v}})} />
                <Input label="Phone" value={settings.contact?.phone} onChange={(v: string) => setSettings({...settings, contact: {...settings.contact, phone: v}})} />
                <Input label="Instagram" value={settings.contact?.instagram} onChange={(v: string) => setSettings({...settings, contact: {...settings.contact, instagram: v}})} />
              </div>
            </section>

            <section className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl shadow-black/5">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black uppercase tracking-tight">Expertise</h3>
                <button 
                  onClick={() => {
                    const current = settings.expertise || [];
                    setSettings({...settings, expertise: [...current, { label: 'New Skill', icon: 'Camera' }]});
                  }}
                  className="p-2 bg-[#0EA5E9]/10 text-[#0EA5E9] rounded-lg hover:bg-[#0EA5E9] hover:text-white transition-all"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="space-y-4">
                {(settings.expertise || []).map((exp: any, i: number) => (
                  <div key={i} className="flex gap-4 items-end bg-gray-50 p-4 rounded-2xl relative group">
                    <div className="flex-1">
                      <Input label="Label" value={exp.label} onChange={(v) => {
                        const newExp = [...settings.expertise];
                        newExp[i].label = v;
                        setSettings({...settings, expertise: newExp});
                      }} />
                    </div>
                    <div className="w-32">
                      <Input label="Icon Name" value={exp.icon} onChange={(v) => {
                        const newExp = [...settings.expertise];
                        newExp[i].icon = v;
                        setSettings({...settings, expertise: newExp});
                      }} />
                    </div>
                    <button 
                      onClick={() => {
                        const newExp = settings.expertise.filter((_: any, index: number) => index !== i);
                        setSettings({...settings, expertise: newExp});
                      }}
                      className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl shadow-black/5">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black uppercase tracking-tight">Tech Stack</h3>
                <button 
                  onClick={() => {
                    const current = settings.tech_stack || [];
                    setSettings({...settings, tech_stack: [...current, { name: 'New', color: '#000000' }]});
                  }}
                  className="p-2 bg-[#0EA5E9]/10 text-[#0EA5E9] rounded-lg hover:bg-[#0EA5E9] hover:text-white transition-all"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(settings.tech_stack || []).map((tech: any, i: number) => (
                  <div key={i} className="flex gap-4 items-end bg-gray-50 p-4 rounded-2xl relative group">
                    <div className="flex-1">
                      <Input label="Name" value={tech.name} onChange={(v) => {
                        const newTech = [...settings.tech_stack];
                        newTech[i].name = v;
                        setSettings({...settings, tech_stack: newTech});
                      }} />
                    </div>
                    <div className="w-24">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Color</label>
                      <input 
                        type="color" 
                        value={tech.color} 
                        onChange={(e) => {
                          const newTech = [...settings.tech_stack];
                          newTech[i].color = e.target.value;
                          setSettings({...settings, tech_stack: newTech});
                        }}
                        className="w-full h-12 rounded-xl cursor-pointer bg-transparent border-none p-0"
                      />
                    </div>
                    <button 
                      onClick={() => {
                        const newTech = settings.tech_stack.filter((_: any, index: number) => index !== i);
                        setSettings({...settings, tech_stack: newTech});
                      }}
                      className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <button
              onClick={handleSaveSettings}
              className="px-12 py-5 bg-[#0EA5E9] text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-[#0EA5E9]/20 hover:bg-[#2D2D2D] transition-all flex items-center gap-3"
            >
              <Save size={24} /> Save All Content
            </button>
          </div>
        ) : (
          <div className={`grid gap-3 md:gap-6 ${openedFolderId ? 'grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'}`}>
            {activeTab === 'projects' ? (
              /* PROJECTS TAB */
              <>
                {/* Sub-Folders (Only if in a folder or top-level) */}
                {projects
                  .filter(p => (openedFolderId ? (p as any).parent_id === openedFolderId : !(p as any).parent_id))
                  .map((proj) => (
                    <ItemCard 
                      key={proj.id} 
                      title={proj.title} 
                      subtitle={proj.year} 
                      image={proj.image_url}
                      images={proj.images}
                      onEdit={() => setOpenedFolderId(proj.id!)}
                      onDelete={(e) => {
                        e.stopPropagation();
                        handleDelete('projects', proj.id!);
                      }}
                    />
                  ))}

                {/* Images inside the folder */}
                {openedFolderId && 
                  (projects.find(p => p.id === openedFolderId)?.images || []).map((img, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative aspect-square rounded-3xl overflow-hidden shadow-xl group border-4 border-transparent hover:border-[#0EA5E9] transition-all bg-white"
                    >
                      <img src={img} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 md:bg-black/60 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button 
                          onClick={async (e) => {
                            e.stopPropagation();
                            const proj = projects.find(p => p.id === openedFolderId);
                            if (proj) {
                              const newImgs = proj.images?.filter((_, idx) => idx !== i) || [];
                              await supabase.from('projects').update({ images: newImgs, image_url: newImgs[0] || '' }).eq('id', openedFolderId);
                              fetchData();
                            }
                          }}
                          className="p-3 bg-white text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-lg"
                        >
                          <Trash2 size={20} />
                        </button>
                        {i > 0 && (
                          <button 
                            onClick={async (e) => {
                              e.stopPropagation();
                              const proj = projects.find(p => p.id === openedFolderId);
                              if (proj && proj.images) {
                                const newImgs = [...proj.images];
                                [newImgs[i], newImgs[i-1]] = [newImgs[i-1], newImgs[i]];
                                await supabase.from('projects').update({ images: newImgs, image_url: newImgs[0] }).eq('id', openedFolderId);
                                fetchData();
                              }
                            }}
                            className="p-3 bg-white text-[#0EA5E9] rounded-xl hover:bg-[#0EA5E9] hover:text-white transition-all shadow-lg"
                          >
                            <ChevronLeft size={20} />
                          </button>
                        )}
                      </div>
                      {i === 0 && (
                        <div className="absolute top-2 left-2 bg-[#0EA5E9] text-[8px] text-white font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow-lg">Cover</div>
                      )}
                    </motion.div>
                  ))
                }

                {/* Empty State */}
                {projects.filter(p => (openedFolderId ? (p as any).parent_id === openedFolderId : !(p as any).parent_id)).length === 0 && 
                 (!openedFolderId || (projects.find(p => p.id === openedFolderId)?.images?.length === 0)) && (
                  <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border-2 border-dashed border-gray-200">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Nothing found here yet!</p>
                  </div>
                 )
                }
              </>
            ) : (
              /* VIDEOS TAB */
              videos.length > 0 ? (
                videos.map((vid) => (
                   <ItemCard 
                    key={vid.id} 
                    title={vid.title} 
                    subtitle="Video Showcase" 
                    video={vid.video_url}
                    onEdit={() => startEditing(vid)}
                    onDelete={(e) => {
                      e.stopPropagation();
                      handleDelete('videos', vid.id!);
                    }}
                  />
                ))
              ) : (
                <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border-2 border-dashed border-gray-200">
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No videos found. Add your first video!</p>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingId(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] p-10 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <h3 className="text-3xl font-black tracking-tighter uppercase mb-8">
                {editingId === 'new' ? 'Add New' : 'Edit'} {activeTab === 'projects' ? 'Project' : 'Video'}
              </h3>

              <div className="space-y-6">
                {activeTab === 'projects' ? (
                  <div className="space-y-8 text-left">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input 
                        label="Title" 
                        value={formData.title} 
                        onChange={(v) => setFormData({ ...formData, title: v })} 
                      />
                      <Input 
                        label="Year" 
                        value={formData.year} 
                        onChange={(v) => setFormData({ ...formData, year: v })} 
                      />
                    </div>
                    
                    <Input 
                      label="Description" 
                      value={formData.description} 
                      onChange={(v) => setFormData({ ...formData, description: v })} 
                      textarea 
                    />
                  </div>
                ) : (
                  <>
                    <Input 
                      label="Title" 
                      value={formData.title} 
                      onChange={(v) => setFormData({ ...formData, title: v })} 
                    />
                    <Input 
                      label="Video URL" 
                      value={formData.video_url} 
                      onChange={(v) => setFormData({ ...formData, video_url: v })} 
                    />
                    <div className="mt-2">
                      <label className="text-xs font-black uppercase tracking-widest text-[#0EA5E9] cursor-pointer hover:underline">
                        {uploading ? 'Uploading...' : 'Upload Video to Storage'}
                        <input
                          type="file"
                          className="hidden"
                          accept="video/*"
                          onChange={async (e) => {
                            if (e.target.files?.[0]) {
                              const url = await handleFileUpload(e.target.files[0]);
                              if (url) setFormData({ ...formData, video_url: url });
                            }
                          }}
                        />
                      </label>
                    </div>
                  </>
                )}

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => handleSave(activeTab as 'projects' | 'videos')}
                    className="flex-1 py-4 bg-[#0EA5E9] text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-[#0EA5E9]/20 hover:bg-[#2D2D2D] transition-all flex items-center justify-center gap-2"
                  >
                    <Save size={20} /> Save Changes
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-8 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
                  >
                    Cancel
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

interface ItemCardProps {
  title: string;
  subtitle: string;
  image?: string;
  video?: string;
  images?: string[];
  onEdit: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

function ItemCard({ title, subtitle, image, video, images, onEdit, onDelete }: ItemCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onEdit}
      className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-black/5 group cursor-pointer hover:shadow-2xl hover:shadow-[#0EA5E9]/5 transition-all"
    >
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        {video ? (
          <video 
            src={video} 
            autoPlay 
            muted 
            loop 
            playsInline 
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
          />
        ) : image ? (
          <img src={image} alt={title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
        ) : (
          <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center gap-3">
            <Folder size={48} className="text-[#0EA5E9]/20" />
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Folder</span>
          </div>
        )}
        
        {images && images.length > 1 && (
           <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/20 flex items-center gap-2">
             <div className="w-1.5 h-1.5 bg-[#0EA5E9] rounded-full animate-pulse" />
             <span className="text-[10px] font-black text-white uppercase tracking-widest">{images.length} Items</span>
           </div>
        )}

        <div className="absolute inset-0 bg-black/20 md:bg-black/40 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }} 
            className="p-3 bg-white text-[#2D2D2D] rounded-full hover:bg-[#0EA5E9] hover:text-white transition-all shadow-lg"
          >
            <Edit2 size={18} />
          </button>
          <button 
            onClick={onDelete} 
            className="p-3 bg-white text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-all shadow-lg"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      <div className="p-3 md:p-6">
        <div className="flex justify-between items-center mb-1">
          <h4 className="font-black text-sm md:text-xl tracking-tight uppercase truncate">{title}</h4>
          <ChevronRight size={14} className="text-gray-300 group-hover:text-[#0EA5E9] transition-colors" />
        </div>
        <p className="text-gray-400 font-medium text-[9px] md:text-sm uppercase tracking-wider">{subtitle}</p>
      </div>
    </motion.div>
  );
}

interface InputProps {
  label: string;
  value: any;
  onChange: (v: string) => void;
  textarea?: boolean;
}

function Input({ label, value, onChange, textarea }: InputProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">{label}</label>
      {textarea ? (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-[#0EA5E9] focus:bg-white transition-all outline-none font-bold min-h-[120px]"
        />
      ) : (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-[#0EA5E9] focus:bg-white transition-all outline-none font-bold"
        />
      )}
    </div>
  );
}
