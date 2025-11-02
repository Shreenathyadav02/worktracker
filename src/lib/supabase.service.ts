import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      'https://gnwxgmfljzfblmsuycxx.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdud3hnbWZsanpmYmxtc3V5Y3h4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzNjc0NTQsImV4cCI6MjA3Njk0MzQ1NH0.rKEKUux-wT2nlTqfjVCMbnwdEfAWEq6ENfJk58eEBpY'
    );
  }

  get client() {
    return this.supabase;
  }
}
