import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketService, Ticket } from '../lib/ticket.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <!-- Header with date and refresh -->
      <div class="dashboard-header">
        <div class="header-content">
          <div>
            <h1>Work Tracker Dashboard</h1>
            <p class="subtitle">{{ currentDate | date:'fullDate' }} • Overview of your work progress</p>
          </div>
          <button class="refresh-btn" (click)="refreshDashboard()" [class.loading]="isLoading">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0020 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 004 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
            </svg>
            Refresh
          </button>
        </div>
      </div>

      <!-- Stats Grid with enhanced metrics -->
      <div class="stats-grid">
        <div class="stat-card total" (click)="filterTickets('all')">
          <div class="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
              <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5z"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats?.total || 0 }}</div>
            <div class="stat-label">Total Tickets</div>
            <div class="stat-trend" [class.positive]="stats?.trend?.total > 0" 
                 [class.negative]="stats?.trend?.total < 0">
              <span *ngIf="stats?.trend?.total !== 0">
                {{ stats?.trend?.total > 0 ? '↑' : '↓' }} {{ Math.abs(stats?.trend?.total || 0) }} this week
              </span>
            </div>
          </div>
        </div>

        <div class="stat-card pending" (click)="filterTickets('pending')">
          <div class="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats?.pending || 0 }}</div>
            <div class="stat-label">Pending</div>
            <div class="stat-progress">
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="(stats?.pending / stats?.total) * 100"></div>
              </div>
              <span>{{ ((stats?.pending / stats?.total) * 100 || 0).toFixed(0) }}%</span>
            </div>
          </div>
        </div>

        <div class="stat-card in-progress" (click)="filterTickets('in_progress')">
          <div class="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats?.inProgress || 0 }}</div>
            <div class="stat-label">In Progress</div>
            <div class="stat-progress">
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="(stats?.inProgress / stats?.total) * 100"></div>
              </div>
              <span>{{ ((stats?.inProgress / stats?.total) * 100 || 0).toFixed(0) }}%</span>
            </div>
          </div>
        </div>

        <div class="stat-card completed" (click)="filterTickets('completed')">
          <div class="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats?.completed || 0 }}</div>
            <div class="stat-label">Completed</div>
            <div class="stat-progress">
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="(stats?.completed / stats?.total) * 100"></div>
              </div>
              <span>{{ ((stats?.completed / stats?.total) * 100 || 0).toFixed(0) }}%</span>
            </div>
          </div>
        </div>

        <!-- Enhanced hours tracking -->
        <div class="stat-card hours">
          <div class="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats?.totalHours?.toFixed(1) || 0 }}</div>
            <div class="stat-label">Hours Logged</div>
            <div class="stat-comparison" [class.positive]="stats?.hoursEfficiency > 0" 
                 [class.negative]="stats?.hoursEfficiency < 0">
              <span *ngIf="stats?.hoursEfficiency !== 0">
                {{ stats?.hoursEfficiency > 0 ? '+' : '' }}{{ (stats?.hoursEfficiency * 100).toFixed(0) }}% vs estimate
              </span>
            </div>
          </div>
        </div>

        <!-- <div class="stat-card efficiency">
          <div class="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm1-11a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L13 9.586V9z"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ (stats?.completionRate * 100)?.toFixed(0) || 0 }}%</div>
            <div class="stat-label">Completion Rate</div>
            <div class="stat-trend" [class.positive]="stats?.trend?.completionRate > 0" 
                 [class.negative]="stats?.trend?.completionRate < 0">
              <span *ngIf="stats?.trend?.completionRate !== 0">
                {{ stats?.trend?.completionRate > 0 ? '↑' : '↓' }} {{ Math.abs(stats?.trend?.completionRate * 100).toFixed(0) }}%
              </span>
            </div>
          </div>
        </div> -->

        <!-- New metrics -->
        <div class="stat-card velocity">
          <div class="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 6.5l-3 3 3 3 3-3-3-3zm0 10l-3 3 3 3 3-3-3-3z"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats?.weeklyVelocity || 0 }}</div>
            <div class="stat-label">Weekly Velocity</div>
            <div class="stat-label">tickets/week</div>
          </div>
        </div>

        <div class="stat-card cycle-time">
          <div class="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
              <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats?.avgCycleTime || 0 }}</div>
            <div class="stat-label">Avg Cycle Time</div>
            <div class="stat-label">days</div>
          </div>
        </div>
      </div>

      <!-- Priority Distribution -->
      <div class="distribution-section">
        <h2>Priority Distribution</h2>
        <div class="distribution-grid">
          <div class="priority-item urgent" [style.flex-grow]="stats?.priorityDistribution?.urgent || 1">
            <div class="priority-label">Urgent</div>
            <div class="priority-count">{{ stats?.priorityDistribution?.urgent || 0 }}</div>
          </div>
          <div class="priority-item high" [style.flex-grow]="stats?.priorityDistribution?.high || 1">
            <div class="priority-label">High</div>
            <div class="priority-count">{{ stats?.priorityDistribution?.high || 0 }}</div>
          </div>
          <div class="priority-item medium" [style.flex-grow]="stats?.priorityDistribution?.medium || 1">
            <div class="priority-label">Medium</div>
            <div class="priority-count">{{ stats?.priorityDistribution?.medium || 0 }}</div>
          </div>
          <div class="priority-item low" [style.flex-grow]="stats?.priorityDistribution?.low || 1">
            <div class="priority-label">Low</div>
            <div class="priority-count">{{ stats?.priorityDistribution?.low || 0 }}</div>
          </div>
        </div>
      </div>

      <!-- Recent Tickets with filtering -->
      <div class="recent-tickets">
        <div class="section-header">
          <h2>Recent Tickets</h2>
          <div class="view-actions">
            <button class="view-btn" [class.active]="currentView === 'grid'" (click)="currentView = 'grid'">
              Grid
            </button>
            <button class="view-btn" [class.active]="currentView === 'list'" (click)="currentView = 'list'">
              List
            </button>
          </div>
        </div>
        
        <div class="tickets-container" [class.list-view]="currentView === 'list'">
          <div *ngIf="recentTickets.length === 0" class="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            <p>No tickets yet. Create your first ticket to get started!</p>
          </div>

          <div *ngFor="let ticket of recentTickets" 
               class="ticket-card" 
               [class.list-view]="currentView === 'list'"
               (click)="viewTicket(ticket)">
            <div class="ticket-header">
              <div class="ticket-id-badge">{{ ticket.ticket_id }}</div>
              <div class="ticket-actions">
                <span class="ticket-status" [class]="'status-' + ticket.status">
                  {{ ticket.status.replace('_', ' ') }}
                </span>
                <div class="ticket-commits">
                  <span class="commit-badge" [class.committed]="ticket.frontend_committed" title="Frontend Committed">
                    FE
                  </span>
                  <span class="commit-badge" [class.committed]="ticket.backend_committed" title="Backend Committed">
                    BE
                  </span>
                </div>
              </div>
            </div>
            
            <h3 class="ticket-title">{{ ticket.title }}</h3>
            
            <p class="ticket-description" *ngIf="ticket.description">
              {{ ticket.description }}
            </p>

            <div class="ticket-meta">
              <div class="meta-item">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"/>
                </svg>
                <span>{{ ticket.hours_actual || 0 }}h / {{ ticket.hours_estimated || 0 }}h</span>
              </div>
              
              <div class="meta-item priority" [class]="'priority-' + ticket.priority">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"/>
                </svg>
                <span>{{ ticket.priority }}</span>
              </div>

              <div class="meta-item" *ngIf="ticket.due_date">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"/>
                </svg>
                <!-- <span>{{ ticket.due_date | date:'MMM d' }}</span> -->
              </div>
            </div>

            <!-- Progress bar for individual tickets -->
            <div class="ticket-progress" *ngIf="ticket.hours_estimated">
              <div class="progress-bar">
                <div class="progress-fill" 
                     [style.width.%]="((ticket.hours_actual || 0) / ticket.hours_estimated) * 100"
                     [class.over]="(ticket.hours_actual || 0) > ticket.hours_estimated">
                </div>
              </div>
              <div class="progress-text">
                {{ ((ticket.hours_actual || 0) / ticket.hours_estimated * 100).toFixed(0) }}% complete
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 2rem;
      background: #f8fafc;
      min-height: 100vh;
    }

    .dashboard-header {
      margin-bottom: 2rem;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .dashboard-header h1 {
      font-size: 2.25rem;
      font-weight: 800;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin: 0 0 0.5rem 0;
    }

    .subtitle {
      color: #64748b;
      margin: 0;
      font-size: 1.1rem;
    }

    .refresh-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      color: #475569;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .refresh-btn:hover {
      background: #f1f5f9;
      border-color: #cbd5e1;
    }

    .refresh-btn.loading {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .refresh-btn.loading svg {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .stat-card {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      border: 1px solid #f1f5f9;
      transition: all 0.3s ease;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--card-color), transparent);
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }

    .stat-card.total { --card-color: #3b82f6; }
    .stat-card.pending { --card-color: #f59e0b; }
    .stat-card.in-progress { --card-color: #8b5cf6; }
    .stat-card.completed { --card-color: #10b981; }
    .stat-card.hours { --card-color: #ef4444; }
    .stat-card.efficiency { --card-color: #06b6d4; }
    .stat-card.velocity { --card-color: #f97316; }
    .stat-card.cycle-time { --card-color: #84cc16; }

    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      background: linear-gradient(135deg, var(--card-color), color-mix(in srgb, var(--card-color) 70%, white));
      color: white;
    }

    .stat-content {
      flex: 1;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 800;
      color: #1e293b;
      line-height: 1.2;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #64748b;
      margin-top: 0.25rem;
      font-weight: 500;
    }

    .stat-trend, .stat-comparison {
      font-size: 0.75rem;
      font-weight: 600;
      margin-top: 0.25rem;
    }

    .stat-trend.positive, .stat-comparison.positive {
      color: #10b981;
    }

    .stat-trend.negative, .stat-comparison.negative {
      color: #ef4444;
    }

    .stat-progress {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }

    .progress-bar {
      flex: 1;
      height: 6px;
      background: #e2e8f0;
      border-radius: 3px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--card-color), color-mix(in srgb, var(--card-color) 80%, white));
      border-radius: 3px;
      transition: width 0.3s ease;
    }

    .progress-fill.over {
      background: linear-gradient(90deg, #ef4444, #f87171);
    }

    .distribution-section {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      margin-bottom: 3rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .distribution-section h2 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 1rem 0;
    }

    .distribution-grid {
      display: flex;
      height: 60px;
      border-radius: 12px;
      overflow: hidden;
      gap: 2px;
    }

    .priority-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: white;
      font-weight: 600;
      font-size: 0.875rem;
      transition: all 0.3s ease;
      position: relative;
      cursor: pointer;
    }

    .priority-item:hover {
      transform: scale(1.05);
      z-index: 2;
    }

    .priority-item.urgent { background: linear-gradient(135deg, #dc2626, #ef4444); }
    .priority-item.high { background: linear-gradient(135deg, #ea580c, #f97316); }
    .priority-item.medium { background: linear-gradient(135deg, #d97706, #f59e0b); }
    .priority-item.low { background: linear-gradient(135deg, #059669, #10b981); }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .recent-tickets h2 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0;
    }

    .view-actions {
      display: flex;
      gap: 0.5rem;
    }

    .view-btn {
      padding: 0.5rem 1rem;
      border: 1px solid #e2e8f0;
      background: white;
      color: #64748b;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .view-btn.active {
      background: #3b82f6;
      color: white;
      border-color: #3b82f6;
    }

    .tickets-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .tickets-container.list-view {
      grid-template-columns: 1fr;
    }

    .ticket-card {
      background: white;
      border: 1px solid #f1f5f9;
      border-radius: 12px;
      padding: 1.5rem;
      transition: all 0.3s ease;
      cursor: pointer;
      position: relative;
    }

    .ticket-card.list-view {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .ticket-card:hover {
      border-color: #3b82f6;
      box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.1);
      transform: translateY(-2px);
    }

    .ticket-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .ticket-card.list-view .ticket-header {
      margin-bottom: 0;
      flex: 0 0 auto;
    }

    .ticket-id-badge {
      background: #f1f5f9;
      color: #475569;
      padding: 0.375rem 0.75rem;
      border-radius: 8px;
      font-size: 0.75rem;
      font-weight: 700;
      font-family: 'SF Mono', monospace;
    }

    .ticket-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .ticket-status {
      padding: 0.375rem 0.75rem;
      border-radius: 8px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: capitalize;
    }

    .status-pending { background: #fef3c7; color: #92400e; }
    .status-in_progress { background: #dbeafe; color: #1e40af; }
    .status-completed { background: #d1fae5; color: #065f46; }

    .ticket-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 0.5rem 0;
    }

    .ticket-card.list-view .ticket-title {
      flex: 1;
      margin: 0;
    }

    .ticket-description {
      color: #64748b;
      font-size: 0.875rem;
      margin: 0 0 1rem 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .ticket-card.list-view .ticket-description {
      flex: 2;
      margin: 0;
    }

    .ticket-meta {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .ticket-card.list-view .ticket-meta {
      margin-bottom: 0;
      flex: 1;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.875rem;
      color: #64748b;
    }

    .meta-item.priority {
      text-transform: capitalize;
      font-weight: 600;
    }

    .priority-low { color: #059669; }
    .priority-medium { color: #d97706; }
    .priority-high { color: #dc2626; }
    .priority-urgent { color: #991b1b; font-weight: 700; }

    .ticket-commits {
      display: flex;
      gap: 0.5rem;
    }

    .commit-badge {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 24px;
      border-radius: 6px;
      font-size: 0.7rem;
      font-weight: 700;
      background: #fecaca;
      color: #dc2626;
    }

    .commit-badge.committed {
      background: #bbf7d0;
      color: #16a34a;
    }

    .ticket-progress {
      margin-top: 1rem;
    }

    .progress-text {
      font-size: 0.75rem;
      color: #64748b;
      margin-top: 0.25rem;
      text-align: center;
    }

    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 4rem 2rem;
      color: #94a3b8;
      background: white;
      border-radius: 12px;
      border: 2px dashed #e2e8f0;
    }

    .empty-state svg {
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    @media (max-width: 768px) {
      .dashboard {
        padding: 1rem;
      }

      .header-content {
        flex-direction: column;
        gap: 1rem;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .tickets-container {
        grid-template-columns: 1fr;
      }

      .ticket-card.list-view {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
      }

      .distribution-grid {
        flex-direction: column;
        height: auto;
      }

      .priority-item {
        height: 50px;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  @Input() stats: any;
  recentTickets: Ticket[] = [];
  currentDate = new Date();
  isLoading = false;
  currentView: 'grid' | 'list' = 'grid';
  Math = Math;

  constructor(private ticketService: TicketService) {}

  async ngOnInit() {
    await this.loadRecentTickets();
  }

  async loadRecentTickets() {
    try {
      const tickets = await this.ticketService.getTickets();
      this.recentTickets = tickets.slice(0, 6);
    } catch (error) {
      console.error('Error loading tickets:', error);
    }
  }

  async refreshDashboard() {
    this.isLoading = true;
    try {
      await this.loadRecentTickets();
      // Add a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      this.isLoading = false;
    }
  }

  filterTickets(status: string) {
    // Implement filter logic here
    console.log('Filtering by:', status);
  }

  viewTicket(ticket: Ticket) {
    // Implement view ticket logic here
    console.log('Viewing ticket:', ticket.ticket_id);
  }
}