import { Component, OnInit } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AuthService } from './lib/auth.service';
import { TicketService } from './lib/ticket.service';
import { AuthComponent } from './components/auth.component';
import { NavbarComponent } from './components/navbar.component';
import { SidebarComponent, ViewType } from './components/sidebar.component';
import { FooterComponent } from './components/footer.component';
import { DashboardComponent } from './components/dashboard.component';
import { TicketsListComponent } from './components/tickets-list.component';
import { TicketFormComponent } from './components/ticket-form.component';
import { Ticket } from './lib/ticket.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    AuthComponent,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    DashboardComponent,
    TicketsListComponent,
    TicketFormComponent
  ],
  template: `
    <div class="app">
      <app-auth *ngIf="!(currentUser$ | async)"></app-auth>

      <div *ngIf="currentUser$ | async" class="app-layout" [class.sidebar-collapsed]="sidebarCollapsed">
        <app-navbar (toggleSidebarEvent)="toggleMobileSidebar()"></app-navbar>
        
        <div class="layout-container">
          <app-sidebar
            [activeView]="activeView"
            [stats]="stats"
            [isCollapsed]="sidebarCollapsed"
            [isMobileOpen]="isMobileOpen"
            (viewChange)="changeView($event)"
            (toggleCollapseEvent)="toggleSidebar()"
            (closeMobileEvent)="closeMobileSidebar()">
          </app-sidebar>

          <main class="main-content" [class.mobile-open]="isMobileOpen">
            <div class="content-wrapper">
              <app-dashboard
                *ngIf="activeView === 'dashboard'"
                [stats]="stats">
              </app-dashboard>

              <app-tickets-list
                *ngIf="activeView === 'tickets'"
                (editTicketEvent)="handleEditTicket($event)">
              </app-tickets-list>

              <app-ticket-form
                *ngIf="activeView === 'add-ticket'"
                [editTicket]="editingTicket"
                (ticketSaved)="handleTicketSaved()"
                (cancelEvent)="handleCancelEdit()">
              </app-ticket-form>
            </div>
            
            <app-footer class="main-footer"></app-footer>
          </main>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .app {
      min-height: 100vh;
    }

    .app-layout {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .layout-container {
      display: flex;
      flex: 1;
      margin-top: 64px; /* Navbar height */
      min-height: calc(100vh - 64px);
      position: relative;
    }

    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      margin-left: 280px; /* Match sidebar width */
      background: #f9fafb;
      min-height: calc(100vh - 64px);
      transition: margin-left 0.3s ease;
    }

    /* When sidebar is collapsed */
    .sidebar-collapsed .main-content {
      margin-left: 72px; /* Match collapsed sidebar width */
    }

    .content-wrapper {
      flex: 1;
      padding: 2rem;
      min-height: calc(100vh - 180px); /* Account for navbar + footer */
    }

    .main-footer {
      margin-top: auto;
    }

    /* Mobile styles */
    @media (max-width: 768px) {
      .layout-container {
        margin-top: 56px; /* Smaller navbar on mobile */
        min-height: calc(100vh - 56px);
      }

      .main-content {
        margin-left: 0;
        min-height: calc(100vh - 56px);
        width: 100%;
      }

      .content-wrapper {
        padding: 1rem;
        min-height: calc(100vh - 120px); /* Adjust for mobile */
      }

      /* When mobile sidebar is open, add overlay effect */
      .main-content.mobile-open::before {
        content: '';
        position: fixed;
        top: 56px;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 998;
      }
    }
  `]
})
export class App implements OnInit {
  currentUser$!: Observable<any>;
  activeView: ViewType = 'dashboard';
  stats: any = null;
  sidebarCollapsed = false;
  isMobileOpen = false;
  editingTicket?: Ticket;

  constructor(
    private authService: AuthService,
    private ticketService: TicketService
  ) {}

  async ngOnInit() {
    // Initialize currentUser$ in ngOnInit
    this.currentUser$ = this.authService.currentUser$;
    
    this.currentUser$.subscribe(user => {
      if (user) {
        this.loadStats();
      }
    });
  }

  async loadStats() {
    try {
      this.stats = await this.ticketService.getStatistics();
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }

  changeView(view: ViewType) {
    this.activeView = view;
    this.editingTicket = undefined;
    
    // Close mobile sidebar when a view is selected
    if (window.innerWidth <= 768) {
      this.closeMobileSidebar();
    }
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  toggleMobileSidebar() {
    this.isMobileOpen = !this.isMobileOpen;
  }

  closeMobileSidebar() {
    this.isMobileOpen = false;
  }

  handleEditTicket(ticket: Ticket) {
    this.editingTicket = ticket;
    this.activeView = 'add-ticket';
  }

  async handleTicketSaved() {
    await this.loadStats();
    this.editingTicket = undefined;
    this.activeView = 'tickets';
  }

  handleCancelEdit() {
    this.editingTicket = undefined;
    this.activeView = 'tickets';
  }
}

bootstrapApplication(App, {
  providers: [
    AuthService,
    TicketService
    // Add other services if needed
  ]
});