import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://uojvfdivwhcisbdaojrd.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvanZmZGl2d2hjaXNiZGFvanJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3MTczMjksImV4cCI6MjA5NzI5MzMyOX0.SxpYeMbMmxTwSJMdeUWhi_QwbqCKy6uSLFvW0v_qoSY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
