import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jdrizjlgqgcmhmqlhkuw.supabase.co'; // Replace with your Project URL from Settings > API
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impkcml6amxncWdjbWhtcWxoa3V3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4MzIxMjksImV4cCI6MjA3MDQwODEyOX0.qEFjKJulcIniXLUN-s5A7KJtYa6u5XpSm-A_jWnlddE'; // Replace with your anon public key from Settings > API
export const supabase = createClient(supabaseUrl, supabaseKey);