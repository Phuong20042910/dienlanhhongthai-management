import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('Warning: Supabase URL or Service Role Key is missing in .env file');
}

// Chúng ta sử dụng Service Role Key ở Backend để bypass RLS (Row Level Security) 
// cho các tác vụ admin hoặc chạy logic trên server một cách an toàn.
export const supabase = createClient(supabaseUrl, supabaseServiceKey);
