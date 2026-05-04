
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pihhtsvshfllrxonagim.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpaGh0c3ZzaGZsbHJ4b25hZ2ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4NzEzMzIsImV4cCI6MjA5MzQ0NzMzMn0.hMEBlb5mTpVn22EgqrQdyfgZvHj6KTvPgqf843UHGt4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function updateSettings() {
  // Get current settings
  const { data: settsData } = await supabase.from('site_settings').select('*');
  
  const hero = settsData?.find(s => s.key === 'hero')?.value || {};
  const about = settsData?.find(s => s.key === 'about')?.value || {};
  
  const newHero = { ...hero, image_url: 'https://pihhtsvshfllrxonagim.supabase.co/storage/v1/object/public/sajith/hero_profile.jpg' };
  const newAbout = { ...about, image_url: 'https://pihhtsvshfllrxonagim.supabase.co/storage/v1/object/public/sajith/hero_about.png' };
  
  await supabase.from('site_settings').upsert({ key: 'hero', value: newHero });
  await supabase.from('site_settings').upsert({ key: 'about', value: newAbout });
  
  console.log('Database updated with new image URLs!');
}

updateSettings();
