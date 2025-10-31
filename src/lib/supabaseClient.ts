import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const SUPABASE_URL = 'https://vtfsbogpkrcbfuhhoepf.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0ZnNib2dwa3JjYmZ1aGhvZXBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyODU0NjQsImV4cCI6MjA2NTg2MTQ2NH0.qy5Depk1nfahqIO6Ixwf2FeLqrxfghYDEWAy43cwQe8';

// Throw an error if the environment variables are not set.
if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  throw new Error('Supabase URL or anonymous key is missing. Make sure you have a .env.development file with VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.');
}

// Create a single Supabase client instance.
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true, // Let Supabase handle session persistence.
    detectSessionInUrl: false,
  },
  // Initialize the global property to ensure it exists.
  global: {
    headers: {},
  },
});

// The following utility functions remain unchanged.
import { toZonedTime, fromZonedTime } from 'date-fns-tz';

// Utility function to convert a local date to UTC string for Supabase
export const toUTC = (date: Date, timeZone: string): Date => {
  return fromZonedTime(date, timeZone);
};

// Utility function to convert a UTC date string from Supabase to a zoned date
export const fromUTC = (utcDateString: string, timeZone: string): Date => {
  const utcDate = new Date(utcDateString);
  return toZonedTime(utcDate, timeZone);
};