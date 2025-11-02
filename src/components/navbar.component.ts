import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../lib/auth.service';
import { Observable } from 'rxjs';
import { User } from '@supabase/supabase-js';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="navbar">
      <div class="navbar-container">
        <!-- Left Section: Brand & Mobile Menu -->
        <div class="navbar-left">
          <button class="mobile-menu-btn" (click)="toggleSidebarEvent.emit()" aria-label="Toggle menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 12h18M3 6h18M3 18h18"/>
            </svg>
          </button>
          
          <div class="navbar-brand">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect x="4" y="4" width="24" height="24" rx="4" fill="url(#grad1)"/>
              <path d="M12 10h8v2h-8zm0 5h8v2h-8zm0 5h5v2h-5z" fill="white"/>
              <defs>
                <linearGradient id="grad1" x1="4" y1="4" x2="28" y2="28">
                  <stop offset="0%" stop-color="#2563eb"/>
                  <stop offset="100%" stop-color="#1e40af"/>
                </linearGradient>
              </defs>
            </svg>
            <span class="brand-text">WorkTracker</span>
          </div>
        </div>

        <!-- Right Section: User Info & Actions -->
        <div class="navbar-right">
          <div class="user-info" *ngIf="currentUser$ | async as user">
            <!-- User Avatar with Fallback -->
            <div class="user-avatar" (click)="toggleDropdown()">
              <span class="avatar-fallback">
                {{ getUserInitials(user.email) }}
              </span>
              <svg *ngIf="!isDropdownOpen" class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 9l6 6 6-6"/>
              </svg>
              <svg *ngIf="isDropdownOpen" class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 15l-6-6-6 6"/>
              </svg>
            </div>

            <!-- Desktop User Info -->
            <div class="desktop-user">
              <span class="user-email">{{ user.email }}</span>
              <span class="user-role">Admin</span>
            </div>

            <!-- Dropdown Menu -->
            <div class="dropdown-menu" [class.show]="isDropdownOpen">
              <div class="dropdown-header">
                <div class="dropdown-avatar">
                  {{ getUserInitials(user.email) }}
                </div>
                <div class="dropdown-user-info">
                  <span class="dropdown-email">{{ user.email }}</span>
                  <span class="dropdown-role">Administrator</span>
                </div>
              </div>
              
              <div class="dropdown-divider"></div>
              
              <button class="dropdown-item" (click)="openSettings()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/>
                  <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
                </svg>
                Settings
              </button>
              
              <button class="dropdown-item" (click)="openProfile()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Profile
              </button>
              
              <div class="dropdown-divider"></div>
              
              <button class="dropdown-item signout" (click)="signOut()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                  <polyline points="16,17 21,12 16,7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Dropdown Backdrop -->
      <div class="dropdown-backdrop" 
           [class.show]="isDropdownOpen" 
           (click)="closeDropdown()">
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      height: 64px;
    }

    .navbar-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100%;
      padding: 0 1.5rem;
      max-width: 1800px;
      margin: 0 auto;
    }

    .navbar-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .mobile-menu-btn {
      display: none;
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 6px;
      transition: background-color 0.2s;
    }

    .mobile-menu-btn:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .navbar-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .brand-text {
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
      letter-spacing: -0.02em;
    }

    .navbar-right {
      display: flex;
      align-items: center;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
      position: relative;
    }

    .user-avatar {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 8px;
      transition: background-color 0.2s;
    }

    .user-avatar:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .avatar-fallback {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      font-size: 0.875rem;
      border: 2px solid rgba(255, 255, 255, 0.3);
    }

    .chevron {
      color: rgba(255, 255, 255, 0.8);
      transition: transform 0.2s;
    }

    .desktop-user {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .user-email {
      color: rgba(255, 255, 255, 0.9);
      font-size: 0.875rem;
      font-weight: 500;
    }

    .user-role {
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.75rem;
    }

    /* Dropdown Menu */
    .dropdown-menu {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 0.5rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      min-width: 240px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.2s ease;
      z-index: 1001;
    }

    .dropdown-menu.show {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .dropdown-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 1.25rem;
      border-bottom: 1px solid #f1f5f9;
    }

    .dropdown-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      font-size: 0.875rem;
    }

    .dropdown-user-info {
      display: flex;
      flex-direction: column;
    }

    .dropdown-email {
      font-size: 0.875rem;
      font-weight: 500;
      color: #1e293b;
    }

    .dropdown-role {
      font-size: 0.75rem;
      color: #64748b;
    }

    .dropdown-divider {
      height: 1px;
      background: #f1f5f9;
      margin: 0.5rem 0;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      padding: 0.75rem 1.25rem;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 0.875rem;
      color: #475569;
      transition: background-color 0.2s;
    }

    .dropdown-item:hover {
      background: #f8fafc;
      color: #1e293b;
    }

    .dropdown-item.signout {
      color: #dc2626;
    }

    .dropdown-item.signout:hover {
      background: #fef2f2;
      color: #b91c1c;
    }

    /* Dropdown Backdrop */
    .dropdown-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: transparent;
      z-index: 999;
      display: none;
    }

    .dropdown-backdrop.show {
      display: block;
    }

    /* Mobile Styles */
    @media (max-width: 768px) {
      .navbar-container {
        padding: 0 1rem;
      }

      .mobile-menu-btn {
        display: block;
      }

      .desktop-user {
        display: none;
      }

      .brand-text {
        font-size: 1.25rem;
      }

      .user-avatar {
        gap: 0.25rem;
      }

      .dropdown-menu {
        position: fixed;
        top: 64px;
        left: 1rem;
        right: 1rem;
        margin-top: 0;
      }
    }

    @media (max-width: 480px) {
      .navbar {
        height: 56px;
      }

      .dropdown-menu {
        top: 56px;
      }

      .avatar-fallback {
        width: 32px;
        height: 32px;
        font-size: 0.75rem;
      }
    }
  `]
})
export class NavbarComponent implements OnInit {
  @Output() toggleSidebarEvent = new EventEmitter<void>();
  
  currentUser$!: Observable<any>;
  isDropdownOpen = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.currentUser$ = this.authService.currentUser$;
  }

  getUserInitials(email: string): string {
    return email.charAt(0).toUpperCase();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  openSettings() {
    console.log('Open settings');
    this.closeDropdown();
    // Implement settings navigation
  }

  openProfile() {
    console.log('Open profile');
    this.closeDropdown();
    // Implement profile navigation
  }

  async signOut() {
    try {
      await this.authService.signOut();
      this.closeDropdown();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }
}