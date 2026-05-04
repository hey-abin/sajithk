const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pihhtsvshfllrxonagim.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpaGh0c3ZzaGZsbHJ4b25hZ2ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4NzEzMzIsImV4cCI6MjA5MzQ0NzMzMn0.hMEBlb5mTpVn22EgqrQdyfgZvHj6KTvPgqf843UHGt4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  const { data, error } = await supabase.storage.listBuckets();
  if (error) {
    console.error('Error listing buckets:', error.message);
  } else {
    console.log('Buckets:', data);
  }
}

main();
