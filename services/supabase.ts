// ตั้งค่าการเชื่อมต่อกับ Supabase ซึ่งต้องใช้ URL และ Key ที่ได้จากการสร้างโปรเจคใน Supabase
import { createClient } from '@supabase/supabase-js';

// กำหนด URL และ Key ของ Supabase
const SUPABASE_URL = 'https://aysyacmsctqneqrfqoyt.supabase.co';
const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_KEY || '';

// สร้าง client สำหรับเชื่อมต่อกับ Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
