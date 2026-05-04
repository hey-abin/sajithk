import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pihhtsvshfllrxonagim.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpaGh0c3ZzaGZsbHJ4b25hZ2ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4NzEzMzIsImV4cCI6MjA5MzQ0NzMzMn0.hMEBlb5mTpVn22EgqrQdyfgZvHj6KTvPgqf843UHGt4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
