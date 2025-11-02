import { Component, EventEmitter, Output, Input, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ViewType = 'dashboard' | 'tickets' | 'add-ticket' | 'analytics' | 'settings';

interface SidebarStat {
  label: string;
  value: number;
  trend?: number;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <aside class="sidebar" [class.collapsed]="isCollapsed" [class.mobile-open]="isMobileOpen">
      <!-- Header with toggle -->
      <div class="sidebar-header">
        <div class="brand">
          <div class="logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
              <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"/>
            </svg>
          </div>
          <span class="brand-name" *ngIf="!isCollapsed">WorkTracker</span>
        </div>
        <button class="toggle-btn" (click)="toggleCollapse()">
          <svg [class.rotated]="isCollapsed" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        <div class="nav-section">
          <h3 class="nav-section-title" *ngIf="!isCollapsed">Main</h3>
          <button
            class="nav-item"
            [class.active]="activeView === 'dashboard'"
            (click)="setView('dashboard')"
            [title]="isCollapsed ? 'Dashboard' : ''">
            <div class="nav-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
              </svg>
            </div>
            <span class="nav-label">Dashboard</span>
            <span class="nav-badge" *ngIf="stats?.pending && !isCollapsed">{{ stats.pending }}</span>
          </button>

          <button
            class="nav-item"
            [class.active]="activeView === 'tickets'"
            (click)="setView('tickets')"
            [title]="isCollapsed ? 'All Tickets' : ''">
            <div class="nav-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h6a1 1 0 100-2H7zm0 4a1 1 0 000 2h6a1 1 0 100-2H7z"/>
              </svg>
            </div>
            <span class="nav-label">All Tickets</span>
            <span class="nav-badge" *ngIf="stats?.total && !isCollapsed">{{ stats.total }}</span>
          </button>

          <button
            class="nav-item add-ticket"
            [class.active]="activeView === 'add-ticket'"
            (click)="setView('add-ticket')"
            [title]="isCollapsed ? 'Add Ticket' : ''">
            <div class="nav-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/>
              </svg>
            </div>
            <span class="nav-label">Add Ticket</span>
          </button>
        </div>

        <div class="nav-section">
          <h3 class="nav-section-title" *ngIf="!isCollapsed">Tools</h3>
          <button
            class="nav-item"
            [class.active]="activeView === 'analytics'"
            (click)="setView('analytics')"
            [title]="isCollapsed ? 'Analytics' : ''">
            <div class="nav-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
              </svg>
            </div>
            <span class="nav-label">Analytics</span>
          </button>

          <button
            class="nav-item"
            [class.active]="activeView === 'settings'"
            (click)="setView('settings')"
            [title]="isCollapsed ? 'Settings' : ''">
            <div class="nav-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"/>
              </svg>
            </div>
            <span class="nav-label">Settings</span>
          </button>
        </div>
      </nav>

      <!-- Quick Stats -->
      <div class="sidebar-stats" *ngIf="!isCollapsed && stats">
        <h3 class="stats-title">Quick Stats</h3>
        <div class="stats-grid">
          <div class="stat-card" *ngFor="let stat of formattedStats" [class]="'stat-' + stat.color">
            <div class="stat-icon">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                <path [attr.d]="stat.icon"/>
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
              <div class="stat-trend" *ngIf="stat.trend !== undefined" [class.positive]="stat.trend > 0" [class.negative]="stat.trend < 0">
                {{ stat.trend > 0 ? '↗' : '↘' }} {{ Math.abs(stat.trend) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- User Profile -->
      <div class="user-profile" *ngIf="!isCollapsed">
        <!-- <div class="user-avatar">
          <img [src]="userAvatar" alt="User avatar" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNFRjVGMzYiLz4KPHBhdGggZD0iTTIwIDIyQzE2LjY4IDIyIDE0IDIwLjY1NiAxNCAxOUgxNkMxNiAyMC4xMDQgMTcuNzkgMjAgMjAgMjBDMjIuMjEgMjAgMjQgMjAuMTA0IDI0IDE5SDI2QzI2IDIwLjY1NiAyMy4zMiAyMiAyMCAyMloiIGZpbGw9IiDCA4QzZGIi8+CjxjaXJjbGUgY3g9IjIwIiBjeT0iMTYiIHI9IjQiIGZpbGw9IiDCA4QzZGIi8+Cjwvc3ZnPgo='" />
        </div>
        <div class="user-info">
          <div class="user-name">{{ userName }}</div>
          <div class="user-role">{{ userRole }}</div>
        </div> -->
        <button class="logout-btn" title="Logout">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 00-1 1v2a1 1 0 102 0V9a1 1 0 00-1-1z"/>
          </svg>
        </button>
      </div>

      <!-- Mobile overlay -->
      <div class="mobile-overlay" *ngIf="isMobileOpen" (click)="closeMobile()"></div>
    </aside>
  `,
  styles: [`
    .sidebar {
      position: fixed;
      left: 0;
      top: 64px;
      bottom: 60px;
      width: 280px;
      background: #ffffff;
      border-right: 1px solid #e5e7eb;
      display: flex;
      flex-direction: column;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 1000;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .sidebar.collapsed {
      width: 72px;
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.5rem 1.25rem 1rem;
      border-bottom: 1px solid #f3f4f6;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .logo {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;
    }

    .brand-name {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1f2937;
      white-space: nowrap;
    }

    .toggle-btn {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 0.5rem;
      color: #64748b;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .toggle-btn:hover {
      background: #f1f5f9;
      color: #374151;
    }

    .toggle-btn .rotated {
      transform: rotate(180deg);
    }

    .sidebar-nav {
      flex: 1;
      padding: 1rem 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .nav-section {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .nav-section-title {
      font-size: 0.75rem;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0 0 0.5rem 0.75rem;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      background: transparent;
      border: none;
      border-radius: 8px;
      color: #4b5563;
      font-size: 0.9375rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      text-align: left;
      position: relative;
      width: 100%;
    }

    .nav-item:hover {
      background: #f8fafc;
      color: #2563eb;
      transform: translateX(2px);
    }

    .nav-item.active {
      background: #eff6ff;
      color: #2563eb;
      box-shadow: 0 1px 3px rgba(59, 130, 246, 0.1);
    }

    .nav-item.add-ticket {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      margin-top: 0.5rem;
    }

    .nav-item.add-ticket:hover {
      background: linear-gradient(135deg, #059669 0%, #047857 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }

    .nav-icon {
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .nav-label {
      white-space: nowrap;
      flex: 1;
    }

    .nav-badge {
      background: #ef4444;
      color: white;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.125rem 0.5rem;
      border-radius: 12px;
      min-width: 20px;
      text-align: center;
    }

    .sidebar-stats {
      padding: 1.5rem 1rem;
      border-top: 1px solid #f3f4f6;
    }

    .stats-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: #374151;
      margin: 0 0 1rem 0;
    }

    .stats-grid {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem;
      background: #f8fafc;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      transition: all 0.2s;
    }

    .stat-card:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .stat-icon {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .stat-total .stat-icon { background: #eff6ff; color: #3b82f6; }
    .stat-pending .stat-icon { background: #fef3c7; color: #d97706; }
    .stat-progress .stat-icon { background: #dbeafe; color: #2563eb; }
    .stat-completed .stat-icon { background: #d1fae5; color: #059669; }

    .stat-content {
      flex: 1;
    }

    .stat-value {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1f2937;
      line-height: 1.2;
    }

    .stat-label {
      font-size: 0.75rem;
      color: #6b7280;
      margin-top: 0.125rem;
    }

    .stat-trend {
      font-size: 0.625rem;
      font-weight: 600;
      margin-top: 0.25rem;
    }

    .stat-trend.positive { color: #059669; }
    .stat-trend.negative { color: #dc2626; }

    .user-profile {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 1.25rem;
      border-top: 1px solid #f3f4f6;
      background: #fafafa;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
      flex-shrink: 0;
    }

    .user-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .user-info {
      flex: 1;
      min-width: 0;
    }

    .user-name {
      font-size: 0.875rem;
      font-weight: 600;
      color: #1f2937;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-role {
      font-size: 0.75rem;
      color: #6b7280;
    }

    .logout-btn {
      background: transparent;
      border: none;
      color: #9ca3af;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 4px;
      transition: all 0.2s;
    }

    .logout-btn:hover {
      background: #fee2e2;
      color: #dc2626;
    }

    .mobile-overlay {
      position: fixed;
      top: 64px;
      left: 0;
      right: 0;
      bottom: 60px;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999;
      display: none;
    }

    /* Mobile styles */
    @media (max-width: 768px) {
      .sidebar {
        transform: translateX(-100%);
        bottom: 0;
        top: 0;
        z-index: 1000;
      }

      .sidebar.mobile-open {
        transform: translateX(0);
      }

      .mobile-overlay {
        display: block;
      }

      .sidebar.collapsed {
        width: 280px;
        transform: translateX(-100%);
      }

      .sidebar.collapsed.mobile-open {
        transform: translateX(0);
      }
    }

    /* Scrollbar styling */
    .sidebar::-webkit-scrollbar {
      width: 4px;
    }

    .sidebar::-webkit-scrollbar-track {
      background: #f1f5f9;
    }

    .sidebar::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 2px;
    }

    .sidebar::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
  `]
})
export class SidebarComponent {
  @Input() activeView: ViewType = 'dashboard';
  @Input() stats: any;
  @Input() isCollapsed = false;
  @Input() isMobileOpen = false;
  @Output() viewChange = new EventEmitter<ViewType>();
  @Output() toggleCollapseEvent = new EventEmitter<void>();
  @Output() closeMobileEvent = new EventEmitter<void>();

  
  // User data (in real app, this would come from a service)
  userName = 'John Doe';
  userRole = 'Developer';
  userAvatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face';

  Math = Math;

  get formattedStats(): SidebarStat[] {
    return [
      {
        label: 'Total',
        value: this.stats?.total || 0,
        trend: this.stats?.trend?.total || 0,
        icon: 'M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5z',
        color: 'total'
      },
      {
        label: 'Pending',
        value: this.stats?.pending || 0,
        icon: 'M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z',
        color: 'pending'
      },
      {
        label: 'In Progress',
        value: this.stats?.inProgress || 0,
        icon: 'M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z',
        color: 'progress'
      },
      {
        label: 'Completed',
        value: this.stats?.completed || 0,
        trend: this.stats?.trend?.completionRate ? Math.round(this.stats.trend.completionRate * 100) : 0,
        icon: 'M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z',
        color: 'completed'
      }
    ];
  }

  @HostListener('window:resize')
  onResize() {
    // Auto-close sidebar on mobile when resizing to desktop
    if (window.innerWidth > 768 && this.isMobileOpen) {
      this.closeMobile();
    }
  }

  setView(view: ViewType) {
    this.viewChange.emit(view);
    // Close mobile sidebar after selection
    if (window.innerWidth <= 768) {
      this.closeMobile();
    }
  }

  toggleCollapse() {
    this.toggleCollapseEvent.emit();
  }

  closeMobile() {
    this.closeMobileEvent.emit();
  }
}