
import { createClient } from '@supabase/supabase-js';

// Using direct values as specified rather than environment variables
export const supabase = createClient(
  'https://kujjqfvicrazqitxkdwh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1ampxZnZpY3JhenFpdHhrZHdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5NDUwNjUsImV4cCI6MjA2MTUyMTA2NX0.p1rMYOU6rp6im1PaJyeQydxldKeQ4WXbOinDtsDUxl8'
);
