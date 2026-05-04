
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = 'https://pihhtsvshfllrxonagim.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpaGh0c3ZzaGZsbHJ4b25hZ2ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4NzEzMzIsImV4cCI6MjA5MzQ0NzMzMn0.hMEBlb5mTpVn22EgqrQdyfgZvHj6KTvPgqf843UHGt4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function uploadFile(filePath, fileName) {
  const fileContent = fs.readFileSync(filePath);
  const { data, error } = await supabase.storage
    .from('sajith')
    .upload(fileName, fileContent, {
      upsert: true,
      contentType: fileName.endsWith('.PNG') ? 'image/png' : 'image/jpeg'
    });

  if (error) {
    console.error(`Error uploading ${fileName}:`, error.message);
    return null;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('sajith')
    .getPublicUrl(fileName);

  console.log(`Uploaded ${fileName}: ${publicUrl}`);
  return publicUrl;
}

const images = [
  { path: '/Users/Abin/Documents/new-all/SAJITHK2/src/imports/IMG_4770.JPG', name: 'hero_profile.jpg' },
  { path: '/Users/Abin/Documents/new-all/SAJITHK2/src/imports/IMG_4886.PNG', name: 'hero_about.png' }
];

(async () => {
  for (const img of images) {
    await uploadFile(img.path, img.name);
  }
})();
