import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TicketService, Ticket } from '../lib/ticket.service';

@Component({
  selector: 'app-tickets-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="tickets-list-view">
      <!-- Header Section -->
      <div class="list-header">
        <div class="header-left">
          <h1>All Tickets</h1>
          <span class="ticket-count">{{ filteredTickets.length }} of {{ tickets.length }} tickets</span>
        </div>
        
        <div class="header-right">
          <div class="search-box">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="search-icon">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input 
              type="text" 
              [(ngModel)]="searchQuery" 
              (input)="applyFilters()"
              placeholder="Search tickets..." 
              class="search-input">
          </div>
          
          <div class="filters">
            <select [(ngModel)]="filterStatus" (change)="applyFilters()" class="filter-select">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            
            <select [(ngModel)]="filterPriority" (change)="applyFilters()" class="filter-select">
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>

            <button class="btn-refresh" (click)="loadTickets()" title="Refresh">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="quick-stats">
        <div class="stat-card" *ngFor="let stat of quickStats" [class]="'stat-' + stat.type">
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>

      <!-- Tickets Table -->
      <div class="tickets-table-container">
        <div class="table-header" *ngIf="filteredTickets.length > 0">
          <div class="table-actions">
            <button class="btn-export" (click)="exportTickets()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Export
            </button>
          </div>
        </div>

        <div class="table-wrapper">
          <table class="tickets-table" *ngIf="filteredTickets.length > 0">
            <thead>
              <tr>
                <th (click)="sortTickets('ticket_id')" class="sortable">
                  <div class="th-content">
                    <span>Ticket ID</span>
                    <span class="sort-indicator" *ngIf="sortField === 'ticket_id'">
                      {{ sortDirection === 'asc' ? '↑' : '↓' }}
                    </span>
                  </div>
                </th>
                <th (click)="sortTickets('title')" class="sortable">
                  <div class="th-content">
                    <span>Title & Description</span>
                    <span class="sort-indicator" *ngIf="sortField === 'title'">
                      {{ sortDirection === 'asc' ? '↑' : '↓' }}
                    </span>
                  </div>
                </th>
                <th (click)="sortTickets('status')" class="sortable">
                  <div class="th-content">
                    <span>Status</span>
                    <span class="sort-indicator" *ngIf="sortField === 'status'">
                      {{ sortDirection === 'asc' ? '↑' : '↓' }}
                    </span>
                  </div>
                </th>
                <th (click)="sortTickets('priority')" class="sortable">
                  <div class="th-content">
                    <span>Priority</span>
                    <span class="sort-indicator" *ngIf="sortField === 'priority'">
                      {{ sortDirection === 'asc' ? '↑' : '↓' }}
                    </span>
                  </div>
                </th>
                <th (click)="sortTickets('hours_actual')" class="sortable">
                  <div class="th-content">
                    <span>Hours</span>
                    <span class="sort-indicator" *ngIf="sortField === 'hours_actual'">
                      {{ sortDirection === 'asc' ? '↑' : '↓' }}
                    </span>
                  </div>
                </th>
                <th>
                  <div class="th-content">
                    <span>Commits</span>
                  </div>
                </th>
                <th>
                  <div class="th-content">
                    <span>Actions</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let ticket of filteredTickets; trackBy: trackByTicketId" 
                  (click)="selectTicket(ticket)"
                  [class.selected]="selectedTicket?.id === ticket.id"
                  [class.row-pending]="ticket.status === 'pending'"
                  [class.row-in-progress]="ticket.status === 'in_progress'"
                  [class.row-completed]="ticket.status === 'completed'">
                <td>
                  <div class="cell-content">
                    <span class="ticket-id-badge">{{ ticket.ticket_id }}</span>
                  </div>
                </td>
                <td>
                  <div class="cell-content">
                    <div class="ticket-title-cell">
                      <div class="title">{{ ticket.title }}</div>
                      <div class="description" *ngIf="ticket.description">
                        {{ ticket.description }}
                      </div>
                      <div class="meta-info">
                        <span class="created-date">Created: {{ formatDate(ticket.created_at) }}</span>
                        <span class="last-updated" *ngIf="ticket.updated_at && ticket.updated_at !== ticket.created_at">
                          Updated: {{ formatDate(ticket.updated_at) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="cell-content">
                    <span class="status-badge" [class]="'status-' + ticket.status">
                      {{ ticket.status.replace('_', ' ') }}
                    </span>
                  </div>
                </td>
                <td>
                  <div class="cell-content">
                    <span class="priority-badge" [class]="'priority-' + ticket.priority">
                      {{ ticket.priority }}
                    </span>
                  </div>
                </td>
                <td>
                  <div class="cell-content">
                    <div class="hours-cell">
                      <div class="hours-display">
                        <span class="hours-actual">{{ ticket.hours_actual || 0 }}</span>
                        <span class="hours-separator">/</span>
                        <span class="hours-estimated">{{ ticket.hours_estimated || 0 }}</span>
                      </div>
                      <div class="hours-progress" *ngIf="(ticket.hours_estimated || 0) > 0">
                        <div class="progress-bar">
                          <div class="progress-fill" [style.width.%]="getProgressPercentage(ticket)"></div>
                        </div>
                        <span class="progress-text">{{ getProgressPercentage(ticket) | number:'1.0-0' }}%</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="cell-content">
                    <div class="commits-cell">
                      <span class="commit-indicator" 
                            [class.committed]="ticket.frontend_committed" 
                            title="Frontend">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        FE
                      </span>
                      <span class="commit-indicator" 
                            [class.committed]="ticket.backend_committed" 
                            title="Backend">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        BE
                      </span>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="cell-content">
                    <div class="action-buttons">
                      <button class="btn-icon btn-edit" 
                              (click)="editTicket(ticket); $event.stopPropagation()" 
                              title="Edit">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                        </svg>
                      </button>
                      <button class="btn-icon btn-delete" 
                              (click)="deleteTicket(ticket); $event.stopPropagation()" 
                              title="Delete">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div *ngIf="filteredTickets.length === 0" class="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          <h3>No tickets found</h3>
          <p *ngIf="searchQuery || filterStatus !== 'all' || filterPriority !== 'all'">
            Try adjusting your search or filters
          </p>
          <p *ngIf="!searchQuery && filterStatus === 'all' && filterPriority === 'all'">
            No tickets have been created yet
          </p>
          <button class="btn-primary" *ngIf="tickets.length === 0" (click)="createFirstTicket()">
            Create Your First Ticket
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading tickets...</p>
      </div>
    </div>
  `,
  styles: [`
    .tickets-list-view {
      padding: 2rem;
      background: #f8fafc;
      min-height: 100vh;
    }

    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1.5rem;
    }

    .header-left h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 0.5rem 0;
    }

    .ticket-count {
      font-size: 0.875rem;
      color: #6b7280;
      background: #f1f5f9;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-weight: 500;
    }

    .header-right {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      align-items: flex-end;
    }

    .search-box {
      position: relative;
      min-width: 300px;
    }

    .search-icon {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      color: #9ca3af;
    }

    .search-input {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 2.5rem;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      font-size: 0.875rem;
      background: white;
      transition: all 0.2s;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }

    .search-input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .filters {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }

    .filter-select {
      padding: 0.5rem 1rem;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 0.875rem;
      background: white;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }

    .filter-select:hover {
      border-color: #3b82f6;
    }

    .btn-refresh {
      background: white;
      border: 1px solid #e2e8f0;
      padding: 0.5rem;
      border-radius: 8px;
      cursor: pointer;
      color: #64748b;
      transition: all 0.2s;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }

    .btn-refresh:hover {
      background: #3b82f6;
      color: white;
      border-color: #3b82f6;
      transform: rotate(90deg);
    }

    /* Quick Stats */
    .quick-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 16px;
      border: 1px solid #e2e8f0;
      text-align: center;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .stat-card.stat-total { border-top: 4px solid #3b82f6; }
    .stat-card.stat-pending { border-top: 4px solid #f59e0b; }
    .stat-card.stat-progress { border-top: 4px solid #8b5cf6; }
    .stat-card.stat-completed { border-top: 4px solid #10b981; }

    .stat-value {
      font-size: 2.5rem;
      font-weight: 800;
      color: #1f2937;
      margin-bottom: 0.25rem;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 600;
    }

    /* Table Container */
    .tickets-table-container {
      background: white;
      border-radius: 16px;
      border: 1px solid #e2e8f0;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .table-header {
      padding: 1.25rem 1.5rem;
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      justify-content: flex-end;
    }

    .btn-export {
      background: #10b981;
      color: white;
      border: none;
      padding: 0.625rem 1.25rem;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s;
    }

    .btn-export:hover {
      background: #059669;
      transform: translateY(-1px);
    }

    .table-wrapper {
      overflow-x: auto;
    }

    .tickets-table {
      width: 100%;
      border-collapse: collapse;
      min-width: 1000px;
    }

    .tickets-table thead {
      background: #f8fafc;
    }

    .tickets-table th {
      text-align: left;
      padding: 1rem 1.5rem;
      font-size: 0.75rem;
      font-weight: 600;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid #e2e8f0;
    }

    .th-content {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .sortable {
      cursor: pointer;
      user-select: none;
      transition: background-color 0.2s;
    }

    .sortable:hover {
      background: #f1f5f9;
    }

    .sort-indicator {
      font-weight: bold;
      color: #3b82f6;
    }

    .tickets-table tbody tr {
      border-bottom: 1px solid #f1f5f9;
      cursor: pointer;
      transition: all 0.2s;
    }

    .tickets-table tbody tr:last-child {
      border-bottom: none;
    }

    .tickets-table tbody tr:hover {
      background: #f8fafc;
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .tickets-table tbody tr.selected {
      background: #eff6ff;
      border-left: 4px solid #3b82f6;
    }

    .row-pending { border-left: 4px solid #f59e0b; }
    .row-in-progress { border-left: 4px solid #3b82f6; }
    .row-completed { border-left: 4px solid #10b981; }

    .tickets-table td {
      padding: 1.25rem 1.5rem;
      vertical-align: top;
    }

    .cell-content {
      display: flex;
      align-items: center;
      min-height: 60px;
    }

    .ticket-id-badge {
      background: #f1f5f9;
      color: #475569;
      padding: 0.375rem 0.75rem;
      border-radius: 8px;
      font-size: 0.75rem;
      font-weight: 600;
      font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
      border: 1px solid #e2e8f0;
    }

    .ticket-title-cell .title {
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 0.375rem;
      font-size: 0.95rem;
      line-height: 1.4;
    }

    .ticket-title-cell .description {
      font-size: 0.875rem;
      color: #6b7280;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      margin-bottom: 0.5rem;
    }

    .meta-info {
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
    }

    .created-date, .last-updated {
      font-size: 0.75rem;
      color: #9ca3af;
    }

    .status-badge {
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: capitalize;
      display: inline-block;
      border: 1px solid;
    }

    .status-pending { 
      background: #fffbeb; 
      color: #92400e;
      border-color: #fed7aa;
    }
    .status-in_progress { 
      background: #eff6ff; 
      color: #1e40af;
      border-color: #dbeafe;
    }
    .status-completed { 
      background: #f0fdf4; 
      color: #065f46;
      border-color: #bbf7d0;
    }

    .priority-badge {
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: capitalize;
      display: inline-block;
      border: 1px solid;
    }

    .priority-low { 
      background: #f0fdf4; 
      color: #065f46;
      border-color: #bbf7d0;
    }
    .priority-medium { 
      background: #fffbeb; 
      color: #92400e;
      border-color: #fed7aa;
    }
    .priority-high { 
      background: #fef2f2; 
      color: #991b1b;
      border-color: #fecaca;
    }
    .priority-urgent { 
      background: #991b1b; 
      color: white;
      border-color: #7f1d1d;
    }

    .hours-cell {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .hours-display {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .hours-actual {
      font-weight: 700;
      color: #1f2937;
    }

    .hours-separator {
      color: #d1d5db;
    }

    .hours-estimated {
      color: #6b7280;
    }

    .hours-progress {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .progress-bar {
      flex: 1;
      height: 6px;
      background: #e5e7eb;
      border-radius: 3px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #10b981, #34d399);
      transition: width 0.3s ease;
    }

    .progress-text {
      font-size: 0.75rem;
      color: #6b7280;
      font-weight: 600;
      min-width: 30px;
    }

    .commits-cell {
      display: flex;
      gap: 0.5rem;
    }

    .commit-indicator {
      padding: 0.375rem 0.5rem;
      border-radius: 6px;
      font-size: 0.625rem;
      font-weight: 700;
      background: #f1f5f9;
      color: #64748b;
      border: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      gap: 0.25rem;
      transition: all 0.2s;
    }

    .commit-indicator.committed {
      background: #f0fdf4;
      color: #065f46;
      border-color: #bbf7d0;
    }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .btn-icon {
      background: transparent;
      border: 1px solid #e2e8f0;
      padding: 0.5rem;
      border-radius: 8px;
      cursor: pointer;
      color: #64748b;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-edit:hover {
      background: #eff6ff;
      color: #3b82f6;
      border-color: #3b82f6;
      transform: scale(1.1);
    }

    .btn-delete:hover {
      background: #fef2f2;
      color: #dc2626;
      border-color: #dc2626;
      transform: scale(1.1);
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #9ca3af;
    }

    .empty-state svg {
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    .empty-state h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #6b7280;
      margin-bottom: 0.5rem;
    }

    .btn-primary {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      margin-top: 1rem;
    }

    .btn-primary:hover {
      background: #2563eb;
      transform: translateY(-1px);
    }

    .loading-state {
      text-align: center;
      padding: 3rem;
      color: #6b7280;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #e5e7eb;
      border-top: 4px solid #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .tickets-list-view {
        padding: 1rem;
      }

      .list-header {
        flex-direction: column;
      }

      .header-right {
        align-items: stretch;
        width: 100%;
      }

      .search-box {
        min-width: auto;
      }

      .quick-stats {
        grid-template-columns: repeat(2, 1fr);
      }

      .tickets-table-container {
        border-radius: 12px;
      }
    }
  `]
})
export class TicketsListComponent implements OnInit {
  @Output() editTicketEvent = new EventEmitter<Ticket>();

  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];
  selectedTicket: Ticket | null = null;
  filterStatus = 'all';
  filterPriority = 'all';
  searchQuery = '';
  sortField = 'ticket_id';
  sortDirection: 'asc' | 'desc' = 'asc';
  isLoading = false;
  quickStats: any[] = [];

  constructor(private ticketService: TicketService) {}

  async ngOnInit() {
    await this.loadTickets();
  }

  async loadTickets() {
    this.isLoading = true;
    try {
      this.tickets = await this.ticketService.getTickets();
      this.applyFilters();
      this.updateQuickStats();
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      this.isLoading = false;
    }
  }

  applyFilters() {
    let filtered = this.tickets;

    // Apply search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(ticket => 
        ticket.title.toLowerCase().includes(query) ||
        ticket.description?.toLowerCase().includes(query) ||
        ticket.ticket_id.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (this.filterStatus !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === this.filterStatus);
    }

    // Apply priority filter
    if (this.filterPriority !== 'all') {
      filtered = filtered.filter(ticket => ticket.priority === this.filterPriority);
    }

    this.filteredTickets = this.sortTicketsArray(filtered, this.sortField, this.sortDirection);
  }

  sortTickets(field: string) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  private sortTicketsArray(tickets: Ticket[], field: string, direction: 'asc' | 'desc'): Ticket[] {
    return [...tickets].sort((a, b) => {
      let aValue = (a as any)[field];
      let bValue = (b as any)[field];

      // Handle null/undefined values
      if (aValue == null) aValue = '';
      if (bValue == null) bValue = '';

      // Handle numeric fields
      if (field === 'hours_actual' || field === 'hours_estimated') {
        aValue = aValue || 0;
        bValue = bValue || 0;
      }

      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  updateQuickStats() {
    const total = this.tickets.length;
    const pending = this.tickets.filter(t => t.status === 'pending').length;
    const inProgress = this.tickets.filter(t => t.status === 'in_progress').length;
    const completed = this.tickets.filter(t => t.status === 'completed').length;

    this.quickStats = [
      { type: 'total', value: total, label: 'Total Tickets' },
      { type: 'pending', value: pending, label: 'Pending' },
      { type: 'progress', value: inProgress, label: 'In Progress' },
      { type: 'completed', value: completed, label: 'Completed' }
    ];
  }

  getProgressPercentage(ticket: Ticket): number {
    const estimated = ticket.hours_estimated || 0;
    const actual = ticket.hours_actual || 0;
    
    if (estimated === 0) return 0;
    return Math.min((actual / estimated) * 100, 100);
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  }

  trackByTicketId(index: number, ticket: Ticket): string {
    return ticket.id || ticket.ticket_id;
  }

  selectTicket(ticket: Ticket) {
    this.selectedTicket = this.selectedTicket?.id === ticket.id ? null : ticket;
  }

  editTicket(ticket: Ticket) {
    this.editTicketEvent.emit(ticket);
  }

  async deleteTicket(ticket: Ticket) {
    if (confirm(`Are you sure you want to delete ticket "${ticket.title}"?`)) {
      try {
        await this.ticketService.deleteTicket(ticket.id!);
        await this.loadTickets();
      } catch (error) {
        console.error('Error deleting ticket:', error);
        alert('Failed to delete ticket');
      }
    }
  }

  exportTickets() {
    // Simple CSV export implementation
    const headers = ['Ticket ID', 'Title', 'Status', 'Priority', 'Hours Actual', 'Hours Estimated'];
    const csvData = this.filteredTickets.map(ticket => [
      ticket.ticket_id,
      ticket.title,
      ticket.status,
      ticket.priority,
      ticket.hours_actual || 0,
      ticket.hours_estimated || 0
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tickets-export-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  createFirstTicket() {
    this.editTicketEvent.emit({} as Ticket);
  }
}