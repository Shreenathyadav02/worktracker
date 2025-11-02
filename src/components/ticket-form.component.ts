import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TicketService, Ticket, Task, TimeLog } from '../lib/ticket.service';

@Component({
  selector: 'app-ticket-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers:[TicketService],
  template: `
    <div class="ticket-form-view">
      <div class="form-header">
        <h1>{{ editMode ? 'Edit Ticket' : 'Add New Ticket' }}</h1>
        <button *ngIf="editMode" class="btn-cancel" (click)="cancelEdit()">Cancel</button>
      </div>

      <form (ngSubmit)="saveTicket()" class="ticket-form">
        <div class="form-section">
          <h2>Basic Information</h2>
          <div class="form-grid">
            <div class="form-group">
              <label for="ticket_id">Ticket ID *</label>
              <input
                type="text"
                id="ticket_id"
                [(ngModel)]="ticket.ticket_id"
                name="ticket_id"
                placeholder="e.g., JIRA-123"
                required
              />
            </div>

            <div class="form-group">
              <label for="priority">Priority</label>
              <select id="priority" [(ngModel)]="ticket.priority" name="priority">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div class="form-group full-width">
              <label for="title">Title *</label>
              <input
                type="text"
                id="title"
                [(ngModel)]="ticket.title"
                name="title"
                placeholder="Brief summary of the work"
                required
              />
            </div>

            <div class="form-group full-width">
              <label for="description">Description</label>
              <textarea
                id="description"
                [(ngModel)]="ticket.description"
                name="description"
                rows="3"
                placeholder="Detailed description of the work"
              ></textarea>
            </div>

            <div class="form-group">
              <label for="status">Status</label>
              <select id="status" [(ngModel)]="ticket.status" name="status">
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div class="form-group">
              <label for="hours_estimated">Estimated Hours</label>
              <input
                type="number"
                id="hours_estimated"
                [(ngModel)]="ticket.hours_estimated"
                name="hours_estimated"
                step="0.5"
                min="0"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <div class="form-section">
          <h2>Code Changes</h2>
          <div class="form-grid">
            <div class="form-group full-width">
              <label for="frontend_changes">Frontend Changes</label>
              <textarea
                id="frontend_changes"
                [(ngModel)]="ticket.frontend_changes"
                name="frontend_changes"
                rows="3"
                placeholder="Describe frontend changes made"
              ></textarea>
            </div>

            <div class="form-group full-width">
              <label for="backend_changes">Backend Changes</label>
              <textarea
                id="backend_changes"
                [(ngModel)]="ticket.backend_changes"
                name="backend_changes"
                rows="3"
                placeholder="Describe backend changes made"
              ></textarea>
            </div>

            <div class="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  [(ngModel)]="ticket.frontend_committed"
                  name="frontend_committed"
                />
                <span>Frontend code committed</span>
              </label>
            </div>

            <div class="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  [(ngModel)]="ticket.backend_committed"
                  name="backend_committed"
                />
                <span>Backend code committed</span>
              </label>
            </div>
          </div>
        </div>

        <div class="form-section" *ngIf="editMode">
          <h2>Tasks</h2>
          <div class="tasks-section">
            <div class="task-item" *ngFor="let task of tasks; let i = index">
              <input
                type="checkbox"
                [(ngModel)]="task.completed"
                [name]="'task_completed_' + i"
                (change)="updateTask(task)"
              />
              <input
                type="text"
                [(ngModel)]="task.description"
                [name]="'task_desc_' + i"
                class="task-input"
                (blur)="updateTask(task)"
              />
              <button type="button" class="btn-remove" (click)="removeTask(task)">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
                </svg>
              </button>
            </div>

            <div class="add-task">
              <input
                type="text"
                [(ngModel)]="newTaskDescription"
                [ngModelOptions]="{standalone: true}"
                placeholder="Add a new task..."
                (keyup.enter)="addTask()"
                class="task-input"
              />
              <button type="button" class="btn-add" (click)="addTask()">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div class="form-section" *ngIf="editMode">
          <h2>Time Tracking</h2>
          <div class="time-logs">
            <div class="time-log-item" *ngFor="let log of timeLogs">
              <div class="log-date">{{ formatDate(log.date) }}</div>
              <div class="log-hours">{{ log.hours }}h</div>
              <div class="log-notes">{{ log.notes || 'No notes' }}</div>
            </div>

            <div class="add-time-log">
              <input
                type="date"
                [(ngModel)]="newTimeLog.date"
                [ngModelOptions]="{standalone: true}"
                class="time-input"
              />
              <input
                type="number"
                [(ngModel)]="newTimeLog.hours"
                [ngModelOptions]="{standalone: true}"
                step="0.5"
                min="0"
                placeholder="Hours"
                class="time-input"
              />
              <input
                type="text"
                [(ngModel)]="newTimeLog.notes"
                [ngModelOptions]="{standalone: true}"
                placeholder="Notes (optional)"
                class="time-input notes"
              />
              <button type="button" class="btn-add" (click)="addTimeLog()">Add</button>
            </div>

            <div class="total-hours">
              Total Hours Logged: <strong>{{ totalHours }}h</strong>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary">
            {{ editMode ? 'Update Ticket' : 'Create Ticket' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .ticket-form-view {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .form-header h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0;
    }

    .btn-cancel {
      padding: 0.625rem 1.25rem;
      background: #f3f4f6;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      color: #4b5563;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-cancel:hover {
      background: #e5e7eb;
    }

    .ticket-form {
      background: white;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      padding: 2rem;
    }

    .form-section {
      margin-bottom: 2.5rem;
    }

    .form-section:last-child {
      margin-bottom: 0;
    }

    .form-section h2 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 1.5rem 0;
      padding-bottom: 0.75rem;
      border-bottom: 2px solid #e5e7eb;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group.full-width {
      grid-column: 1 / -1;
    }

    .form-group label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
      margin-bottom: 0.5rem;
    }

    .form-group input[type="text"],
    .form-group input[type="number"],
    .form-group select,
    .form-group textarea {
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 0.9375rem;
      transition: all 0.2s;
      font-family: inherit;
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    .form-group textarea {
      resize: vertical;
      min-height: 80px;
    }

    .checkbox-group label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }

    .checkbox-group input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }

    .tasks-section {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .task-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      background: #f9fafb;
      border-radius: 8px;
    }

    .task-item input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }

    .task-input {
      flex: 1;
      padding: 0.5rem;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 0.9375rem;
    }

    .task-input:focus {
      outline: none;
      border-color: #2563eb;
    }

    .add-task {
      display: flex;
      gap: 0.75rem;
    }

    .btn-add,
    .btn-remove {
      padding: 0.5rem;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      background: white;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-add {
      color: #2563eb;
      border-color: #2563eb;
    }

    .btn-add:hover {
      background: #eff6ff;
    }

    .btn-remove {
      color: #dc2626;
      border-color: #fecaca;
    }

    .btn-remove:hover {
      background: #fef2f2;
    }

    .time-logs {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .time-log-item {
      display: grid;
      grid-template-columns: 120px 80px 1fr;
      gap: 1rem;
      padding: 0.75rem;
      background: #f9fafb;
      border-radius: 8px;
      align-items: center;
    }

    .log-date {
      font-weight: 500;
      color: #4b5563;
    }

    .log-hours {
      font-weight: 600;
      color: #2563eb;
    }

    .log-notes {
      color: #6b7280;
      font-size: 0.875rem;
    }

    .add-time-log {
      display: grid;
      grid-template-columns: 150px 100px 1fr auto;
      gap: 0.75rem;
    }

    .time-input {
      padding: 0.5rem;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 0.9375rem;
    }

    .time-input:focus {
      outline: none;
      border-color: #2563eb;
    }

    .total-hours {
      padding: 1rem;
      background: #eff6ff;
      border-radius: 8px;
      color: #1e40af;
      font-size: 0.9375rem;
      text-align: center;
    }

    .total-hours strong {
      font-size: 1.25rem;
    }

    .form-actions {
      margin-top: 2rem;
      display: flex;
      justify-content: flex-end;
    }

    .btn-primary {
      padding: 0.875rem 2rem;
      background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
      border: none;
      border-radius: 8px;
      color: white;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
    }

    @media (max-width: 768px) {
      .ticket-form-view {
        padding: 1rem;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .add-time-log {
        grid-template-columns: 1fr;
      }

      .time-log-item {
        grid-template-columns: 1fr;
        gap: 0.5rem;
      }
    }
  `]
})
export class TicketFormComponent implements OnInit {
  @Input() editTicket?: Ticket;
  @Output() ticketSaved = new EventEmitter<void>();
  @Output() cancelEvent = new EventEmitter<void>();

  editMode = false;
  ticket: Partial<Ticket> = {
    ticket_id: '',
    title: '',
    description: '',
    frontend_changes: '',
    backend_changes: '',
    frontend_committed: false,
    backend_committed: false,
    hours_estimated: 0,
    hours_actual: 0,
    status: 'pending',
    priority: 'medium'
  };

  tasks: Task[] = [];
  newTaskDescription = '';

  timeLogs: TimeLog[] = [];
  newTimeLog = {
    date: this.getTodayDate(),
    hours: 0,
    notes: ''
  };

  totalHours = 0;

  constructor(private ticketService: TicketService) {}

  ngOnInit() {
    if (this.editTicket) {
      this.editMode = true;
      this.ticket = { ...this.editTicket };
      this.loadTicketData();
    }
  }

  async loadTicketData() {
    if (!this.ticket.id) return;

    try {
      this.tasks = await this.ticketService.getTasks(this.ticket.id);
      this.timeLogs = await this.ticketService.getTimeLogs(this.ticket.id);
      this.calculateTotalHours();
    } catch (error) {
      console.error('Error loading ticket data:', error);
    }
  }

  async saveTicket() {
    try {
      if (this.editMode && this.ticket.id) {
        await this.ticketService.updateTicket(this.ticket.id, this.ticket);
      } else {
        await this.ticketService.createTicket(this.ticket);
      }
      this.ticketSaved.emit();
      this.resetForm();
    } catch (error) {
      console.error('Error saving ticket:', error);
      alert('Failed to save ticket. Please check all required fields.');
    }
  }

  async addTask() {
    if (!this.newTaskDescription.trim() || !this.ticket.id) return;

    try {
      const newTask = await this.ticketService.createTask({
        ticket_id: this.ticket.id,
        description: this.newTaskDescription,
        completed: false,
        order_index: this.tasks.length
      });
      this.tasks.push(newTask);
      this.newTaskDescription = '';
    } catch (error) {
      console.error('Error adding task:', error);
    }
  }

  async updateTask(task: Task) {
    if (!task.id) return;

    try {
      await this.ticketService.updateTask(task.id, task);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }

  async removeTask(task: Task) {
    if (!task.id) return;

    try {
      await this.ticketService.deleteTask(task.id);
      this.tasks = this.tasks.filter(t => t.id !== task.id);
    } catch (error) {
      console.error('Error removing task:', error);
    }
  }

  async addTimeLog() {
    if (!this.newTimeLog.date || !this.newTimeLog.hours || !this.ticket.id) return;

    try {
      const log = await this.ticketService.createTimeLog({
        ticket_id: this.ticket.id,
        date: this.newTimeLog.date,
        hours: this.newTimeLog.hours,
        notes: this.newTimeLog.notes
      });
      this.timeLogs.unshift(log);
      this.calculateTotalHours();

      await this.ticketService.updateTicket(this.ticket.id, {
        hours_actual: this.totalHours
      });

      this.newTimeLog = {
        date: this.getTodayDate(),
        hours: 0,
        notes: ''
      };
    } catch (error) {
      console.error('Error adding time log:', error);
    }
  }

  calculateTotalHours() {
    this.totalHours = this.timeLogs.reduce((sum, log) => sum + log.hours, 0);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  cancelEdit() {
    this.cancelEvent.emit();
  }

  resetForm() {
    this.ticket = {
      ticket_id: '',
      title: '',
      description: '',
      frontend_changes: '',
      backend_changes: '',
      frontend_committed: false,
      backend_committed: false,
      hours_estimated: 0,
      hours_actual: 0,
      status: 'pending',
      priority: 'medium'
    };
    this.tasks = [];
    this.timeLogs = [];
    this.totalHours = 0;
  }
}
