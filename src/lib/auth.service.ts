import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { BehaviorSubject } from 'rxjs';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private supabase: SupabaseService) {
    this.supabase.client.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      (async () => {
        this.currentUserSubject.next(session?.user || null);
      })();
    });

    this.checkUser();
  }

  private async checkUser() {
    const { data: { user } } = await this.supabase.client.auth.getUser();
    this.currentUserSubject.next(user);
  }

  async signUp(email: string, password: string) {
    const { data, error } = await this.supabase.client.auth.signUp({
      email,
      password
    });
    if (error) throw error;
    return data;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.client.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await this.supabase.client.auth.signOut();
    if (error) throw error;
  }

  getCurrentUser() {
    return this.currentUserSubject.value;
  }
}