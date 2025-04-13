import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fvhasxpaxupuhzraaixb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2aGFzeHBheHVwdWh6cmFhaXhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1NDE1OTYsImV4cCI6MjA2MDExNzU5Nn0.wIhbme7ITFsswfb1FT4ZmH-buM-NNMjmp84-P-b7t0A'
export const supabase = createClient(supabaseUrl, supabaseKey)