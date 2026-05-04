import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Edit2, LogOut, Image as ImageIcon, Video as VideoIcon, Save, X, ChevronRight, Menu } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Project {
  id?: string;
  title: string;
  category: string;
  description: string;
  image_url: string;
  year: string;
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
    if (editingId === 'new') {
      const { error } = await supabase.from(table).insert([formData]);
      if (!error) fetchData();
    } else {
      const { error } = await supabase.from(table).update(formData).eq('id', editingId);
      if (!error) fetchData();
    }
    setEditingId(null);
    setFormData({});
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
      { key: 'contact', value: { name: 'SAJITH K', email: 'sajithkizhyapattu@gmail.com', phone: '+91 9567633217', instagram: '@sajith.k', youtube: 'https://youtube.com' } }
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
      setFormData({ title: '', category: '', description: '', image_url: '', year: new Date().getFullYear().toString() });
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
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase">{activeTab === 'settings' ? 'Site Content' : activeTab}</h2>
            <p className="text-gray-500 font-medium mt-1">Manage your {activeTab === 'settings' ? 'website text and info' : `${activeTab} content`}</p>
          </div>
          {activeTab !== 'settings' && (
            <button
              onClick={startNew}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#0EA5E9] text-white rounded-xl font-black uppercase tracking-widest shadow-xl shadow-[#0EA5E9]/20 hover:bg-[#2D2D2D] transition-all"
            >
              <Plus size={20} /> Add New
            </button>
          )}
        </header>

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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Main Title" value={settings.hero?.title} onChange={(v: string) => setSettings({...settings, hero: {...settings.hero, title: v}})} />
                <Input label="Subtitle" value={settings.hero?.subtitle} onChange={(v: string) => setSettings({...settings, hero: {...settings.hero, subtitle: v}})} />
                <Input label="Tagline" value={settings.hero?.tagline} onChange={(v: string) => setSettings({...settings, hero: {...settings.hero, tagline: v}})} />
                <div className="space-y-2">
                  <Input label="Hero Image URL" value={settings.hero?.image_url} onChange={(v: string) => setSettings({...settings, hero: {...settings.hero, image_url: v}})} />
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#0EA5E9] cursor-pointer hover:underline ml-1">
                    {uploading ? 'Uploading...' : 'Upload New Hero Image'}
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
              <div className="space-y-6">
                <Input label="Title" value={settings.about?.title} onChange={(v: string) => setSettings({...settings, about: {...settings.about, title: v}})} />
                <Input label="Description" value={settings.about?.description} onChange={(v: string) => setSettings({...settings, about: {...settings.about, description: v}})} textarea />
                <div className="space-y-2">
                  <Input label="About Image URL" value={settings.about?.image_url} onChange={(v: string) => setSettings({...settings, about: {...settings.about, image_url: v}})} />
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#0EA5E9] cursor-pointer hover:underline ml-1">
                    {uploading ? 'Uploading...' : 'Upload New About Image'}
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
            </section>

            <section className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl shadow-black/5">
              <h3 className="text-2xl font-black mb-6 uppercase tracking-tight">Contact Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Email" value={settings.contact?.email} onChange={(v: string) => setSettings({...settings, contact: {...settings.contact, email: v}})} />
                <Input label="Phone" value={settings.contact?.phone} onChange={(v: string) => setSettings({...settings, contact: {...settings.contact, phone: v}})} />
                <Input label="Instagram" value={settings.contact?.instagram} onChange={(v: string) => setSettings({...settings, contact: {...settings.contact, instagram: v}})} />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTab === 'projects' ? (
              projects.length > 0 ? (
                projects.map((proj) => (
                  <ItemCard 
                    key={proj.id} 
                    title={proj.title} 
                    subtitle={proj.category} 
                    image={proj.image_url}
                    onEdit={() => startEditing(proj)}
                    onDelete={() => handleDelete('projects', proj.id!)}
                  />
                ))
              ) : (
                <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border-2 border-dashed border-gray-200">
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No projects found. Add your first project!</p>
                </div>
              )
            ) : (
              videos.length > 0 ? (
                videos.map((vid) => (
                  <ItemCard 
                    key={vid.id} 
                    title={vid.title} 
                    subtitle="Video Showcase" 
                    image={vid.thumbnail_url}
                    onEdit={() => startEditing(vid)}
                    onDelete={() => handleDelete('videos', vid.id!)}
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
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] p-10 shadow-2xl overflow-hidden"
            >
              <h3 className="text-3xl font-black tracking-tighter uppercase mb-8">
                {editingId === 'new' ? 'Add New' : 'Edit'} {activeTab === 'projects' ? 'Project' : 'Video'}
              </h3>

              <div className="space-y-6">
                <Input 
                  label="Title" 
                  value={formData.title} 
                  onChange={(v) => setFormData({ ...formData, title: v })} 
                />
                
                {activeTab === 'projects' ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <Input 
                        label="Category" 
                        value={formData.category} 
                        onChange={(v) => setFormData({ ...formData, category: v })} 
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
                    <Input 
                      label="Image URL" 
                      value={formData.image_url} 
                      onChange={(v) => setFormData({ ...formData, image_url: v })} 
                    />
                    <div className="mt-2">
                      <label className="text-xs font-black uppercase tracking-widest text-[#0EA5E9] cursor-pointer hover:underline">
                        {uploading ? 'Uploading...' : 'Upload Image to Storage'}
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={async (e) => {
                            if (e.target.files?.[0]) {
                              const url = await handleFileUpload(e.target.files[0]);
                              if (url) setFormData({ ...formData, image_url: url });
                            }
                          }}
                        />
                      </label>
                    </div>
                  </>
                ) : (
                  <>
                    <Input 
                      label="Thumbnail URL" 
                      value={formData.thumbnail_url} 
                      onChange={(v) => setFormData({ ...formData, thumbnail_url: v })} 
                    />
                    <div className="mt-2">
                      <label className="text-xs font-black uppercase tracking-widest text-[#0EA5E9] cursor-pointer hover:underline">
                        {uploading ? 'Uploading...' : 'Upload Thumbnail to Storage'}
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={async (e) => {
                            if (e.target.files?.[0]) {
                              const url = await handleFileUpload(e.target.files[0]);
                              if (url) setFormData({ ...formData, thumbnail_url: url });
                            }
                          }}
                        />
                      </label>
                    </div>
                    <Input 
                      label="Video URL (Placeholder)" 
                      value={formData.video_url} 
                      onChange={(v) => setFormData({ ...formData, video_url: v })} 
                    />
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
  image: string;
  onEdit: () => void;
  onDelete: () => void;
}

function ItemCard({ title, subtitle, image, onEdit, onDelete }: ItemCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-black/5 group"
    >
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        <img src={image} alt={title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button onClick={onEdit} className="p-3 bg-white text-[#2D2D2D] rounded-full hover:bg-[#0EA5E9] hover:text-white transition-all">
            <Edit2 size={18} />
          </button>
          <button onClick={onDelete} className="p-3 bg-white text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-all">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      <div className="p-6">
        <h4 className="font-black text-xl tracking-tight uppercase truncate">{title}</h4>
        <p className="text-gray-500 font-medium text-sm mt-1 uppercase tracking-wider">{subtitle}</p>
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
