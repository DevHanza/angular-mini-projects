import { inject, Injectable, NgZone } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment.development';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private supabase!: SupabaseClient;
  private router = inject(Router);
  private _ngZone = inject(NgZone);

  constructor() {
    this.supabase = createClient(
      environment.supabaseURL,
      environment.supabaseKey
    );
    this.supabase.auth.onAuthStateChange((events, session) => {
      console.log('events', events);
      console.log('session', session);

      localStorage.setItem('session', JSON.stringify(session?.user));

      if (session?.user) {
        this._ngZone.run(() => {
          this.router.navigate(['chat']);
        });
      }
    });
  }

  get isLoggedIn(): boolean {
    const user = localStorage.getItem('session') as string;

    return user === 'undefined' ? false : true;
  }

  async signInWithGoogle() {
    await this.supabase.auth.signInWithOAuth({
      provider: 'google',
    });
  }

  async signOut() {
    await this.supabase.auth.signOut();
  }
}
