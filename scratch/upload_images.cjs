const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://pihhtsvshfllrxonagim.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpaGh0c3ZzaGZsbHJ4b25hZ2ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4NzEzMzIsImV4cCI6MjA5MzQ0NzMzMn0.hMEBlb5mTpVn22EgqrQdyfgZvHj6KTvPgqf843UHGt4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function uploadImage(filePath, fileName) {
  const fileContent = fs.readFileSync(filePath);
  const { data, error } = await supabase.storage
    .from('portfolio')
    .upload(fileName, fileContent, {
      contentType: filePath.endsWith('.JPG') ? 'image/jpeg' : 'image/png',
      upsert: true
    });

  if (error) {
    console.error(`Error uploading ${fileName}:`, error.message);
    return null;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('portfolio')
    .getPublicUrl(fileName);

  console.log(`Uploaded ${fileName} to: ${publicUrl}`);
  return publicUrl;
}

async function main() {
  const img1Path = '/Users/Abin/Documents/new-all/SAJITHK2/src/imports/IMG_4770.JPG';
  const img2Path = '/Users/Abin/Documents/new-all/SAJITHK2/src/imports/IMG_4886.PNG';

  const url1 = await uploadImage(img1Path, 'IMG_4770.JPG');
  const url2 = await uploadImage(img2Path, 'IMG_4886.PNG');

  if (url1 && url2) {
    console.log('Successfully uploaded both images.');
  }
}

main();
