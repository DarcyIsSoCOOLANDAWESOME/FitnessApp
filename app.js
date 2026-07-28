import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://sxgkrtyocsfhpyidtqlu.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4Z2tydHlvY3NmaHB5aWR0cWx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyNjI3ODIsImV4cCI6MjEwMDgzODc4Mn0.qwhXJyz_yjWmt-P65Ar_OCOoCFodM_ab5NEuAzsGhVo";

const supabase = createClient(supabaseUrl, supabaseKey);

console.log("Supabase connected:", supabase);
