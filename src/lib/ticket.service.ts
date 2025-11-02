import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface Ticket {
  id?: string;
  ticket_id: string;
  title: string;
  description?: string;
  frontend_changes?: string;
  backend_changes?: string;
  frontend_committed: boolean;
  backend_committed: boolean;
  hours_estimated?: number;
  hours_actual?: number;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at?: string;
  updated_at?: string;
  user_id?: string;
  due_date?: string;
}

export interface Task {
  id?: string;
  ticket_id: string;
  description: string;
  completed: boolean;
  order_index: number;
  created_at?: string;
}

export interface TimeLog {
  id?: string;
  ticket_id: string;
  date: string;
  hours: number;
  notes?: string;
  created_at?: string;
}

export interface DashboardStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  totalHours: number;
  estimatedHours: number;
  completionRate: number;
  hoursEfficiency: number;
  weeklyVelocity: number;
  avgCycleTime: number;
  trend: {
    total: number;
    completionRate: number;
  };
  priorityDistribution: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  constructor(private supabase: SupabaseService) {}

  async getTickets(): Promise<Ticket[]> {
    const { data, error } = await this.supabase.client
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getTicket(id: string): Promise<Ticket | null> {
    const { data, error } = await this.supabase.client
      .from('tickets')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async createTicket(ticket: Partial<Ticket>): Promise<Ticket> {
    const { data: { user } } = await this.supabase.client.auth.getUser();

    const { data, error } = await this.supabase.client
      .from('tickets')
      .insert([{ ...ticket, user_id: user?.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateTicket(id: string, updates: Partial<Ticket>): Promise<Ticket> {
    const { data, error } = await this.supabase.client
      .from('tickets')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteTicket(id: string): Promise<void> {
    const { error } = await this.supabase.client
      .from('tickets')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async getTasks(ticketId: string): Promise<Task[]> {
    const { data, error } = await this.supabase.client
      .from('tasks')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('order_index');

    if (error) throw error;
    return data || [];
  }

  async createTask(task: Partial<Task>): Promise<Task> {
    const { data, error } = await this.supabase.client
      .from('tasks')
      .insert([task])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    const { data, error } = await this.supabase.client
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteTask(id: string): Promise<void> {
    const { error } = await this.supabase.client
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async getTimeLogs(ticketId: string): Promise<TimeLog[]> {
    const { data, error } = await this.supabase.client
      .from('time_logs')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createTimeLog(timeLog: Partial<TimeLog>): Promise<TimeLog> {
    const { data, error } = await this.supabase.client
      .from('time_logs')
      .insert([timeLog])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getStatistics(): Promise<DashboardStats> {
    // Get all tickets with complete data
    const { data: tickets, error } = await this.supabase.client
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!tickets) return this.getDefaultStats();

    // Get tickets from last week for trend analysis
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const { data: lastWeekTickets } = await this.supabase.client
      .from('tickets')
      .select('*')
      .gte('created_at', oneWeekAgo.toISOString());

    // Calculate basic stats
    const total = tickets.length;
    const pending = tickets.filter(t => t.status === 'pending').length;
    const inProgress = tickets.filter(t => t.status === 'in_progress').length;
    const completed = tickets.filter(t => t.status === 'completed').length;
    const totalHours = tickets.reduce((sum, t) => sum + (t.hours_actual || 0), 0);
    const estimatedHours = tickets.reduce((sum, t) => sum + (t.hours_estimated || 0), 0);
    
    // Calculate enhanced metrics
    const completionRate = total > 0 ? (completed / total) * 100 : 0;
    const hoursEfficiency = estimatedHours > 0 ? ((totalHours - estimatedHours) / estimatedHours) * 100 : 0;
    
    // Calculate weekly velocity (completed tickets this week)
    const weeklyVelocity = lastWeekTickets?.filter(t => 
      t.status === 'completed' && 
      new Date(t.updated_at || t.created_at || '') >= oneWeekAgo
    ).length || 0;

    // Calculate average cycle time (days from creation to completion)
    const completedTickets = tickets.filter(t => t.status === 'completed');
    const avgCycleTime = completedTickets.length > 0 
      ? completedTickets.reduce((sum, ticket) => {
          const created = new Date(ticket.created_at || '');
          const updated = new Date(ticket.updated_at || ticket.created_at || '');
          const cycleTime = (updated.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
          return sum + cycleTime;
        }, 0) / completedTickets.length
      : 0;

    // Calculate trends
    const lastWeekTotal = lastWeekTickets?.length || 0;
    const lastWeekCompleted = lastWeekTickets?.filter(t => t.status === 'completed').length || 0;
    const lastWeekCompletionRate = lastWeekTotal > 0 ? (lastWeekCompleted / lastWeekTotal) * 100 : 0;

    // Priority distribution
    const priorityDistribution = {
      low: tickets.filter(t => t.priority === 'low').length,
      medium: tickets.filter(t => t.priority === 'medium').length,
      high: tickets.filter(t => t.priority === 'high').length,
      urgent: tickets.filter(t => t.priority === 'urgent').length
    };

    return {
      total,
      pending,
      inProgress,
      completed,
      totalHours,
      estimatedHours,
      completionRate: Math.round(completionRate * 10) / 10, // Round to 1 decimal
      hoursEfficiency: Math.round(hoursEfficiency * 10) / 10, // Round to 1 decimal
      weeklyVelocity,
      avgCycleTime: Math.round(avgCycleTime * 10) / 10, // Round to 1 decimal
      trend: {
        total: total - lastWeekTotal,
        completionRate: Math.round((completionRate - lastWeekCompletionRate) * 10) / 10
      },
      priorityDistribution
    };
  }

  async getRecentTickets(limit: number = 6): Promise<Ticket[]> {
    const { data, error } = await this.supabase.client
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  async getTicketsByStatus(status: Ticket['status']): Promise<Ticket[]> {
    const { data, error } = await this.supabase.client
      .from('tickets')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getTicketsByPriority(priority: Ticket['priority']): Promise<Ticket[]> {
    const { data, error } = await this.supabase.client
      .from('tickets')
      .select('*')
      .eq('priority', priority)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async searchTickets(query: string): Promise<Ticket[]> {
    const { data, error } = await this.supabase.client
      .from('tickets')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,ticket_id.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getOverdueTickets(): Promise<Ticket[]> {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await this.supabase.client
      .from('tickets')
      .select('*')
      .lt('due_date', today)
      .neq('status', 'completed')
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async getTicketsWithTimeLogs(): Promise<(Ticket & { time_logs: TimeLog[] })[]> {
    const { data, error } = await this.supabase.client
      .from('tickets')
      .select(`
        *,
        time_logs (*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getWeeklyReport(startDate: string, endDate: string) {
    const { data: timeLogs, error } = await this.supabase.client
      .from('time_logs')
      .select(`
        *,
        tickets (*)
      `)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });

    if (error) throw error;

    const { data: completedTickets } = await this.supabase.client
      .from('tickets')
      .select('*')
      .eq('status', 'completed')
      .gte('updated_at', startDate)
      .lte('updated_at', endDate);

    return {
      timeLogs: timeLogs || [],
      completedTickets: completedTickets || [],
      totalHours: timeLogs?.reduce((sum, log) => sum + log.hours, 0) || 0,
      ticketsCompleted: completedTickets?.length || 0
    };
  }

  async getTicketsWithProgress(): Promise<(Ticket & { progress: number })[]> {
    const tickets = await this.getTickets();
    
    return tickets.map(ticket => ({
      ...ticket,
      progress: this.calculateTicketProgress(ticket)
    }));
  }

  async getTicketsByDateRange(startDate: string, endDate: string): Promise<Ticket[]> {
    const { data, error } = await this.supabase.client
      .from('tickets')
      .select('*')
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async bulkUpdateTickets(ticketIds: string[], updates: Partial<Ticket>): Promise<void> {
    const { error } = await this.supabase.client
      .from('tickets')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .in('id', ticketIds);

    if (error) throw error;
  }

  async getTicketMetrics(ticketId: string) {
    const [ticket, timeLogs, tasks] = await Promise.all([
      this.getTicket(ticketId),
      this.getTimeLogs(ticketId),
      this.getTasks(ticketId)
    ]);

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    const totalLoggedHours = timeLogs.reduce((sum, log) => sum + log.hours, 0);
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return {
      ticket,
      timeLogs,
      tasks,
      metrics: {
        totalLoggedHours,
        completedTasks,
        totalTasks,
        completionPercentage: Math.round(completionPercentage * 10) / 10,
        hoursRemaining: (ticket.hours_estimated || 0) - totalLoggedHours,
        efficiency: ticket.hours_estimated ? (totalLoggedHours / ticket.hours_estimated) * 100 : 0
      }
    };
  }

  private calculateTicketProgress(ticket: Ticket): number {
    if (ticket.status === 'completed') return 100;
    if (ticket.status === 'in_progress') {
      if (ticket.hours_estimated && ticket.hours_estimated > 0) {
        const actual = ticket.hours_actual || 0;
        return Math.min((actual / ticket.hours_estimated) * 100, 90); // Cap at 90% until completed
      }
      return 50; // Default progress for in_progress without hours
    }
    return 0; // pending
  }

  private getDefaultStats(): DashboardStats {
    return {
      total: 0,
      pending: 0,
      inProgress: 0,
      completed: 0,
      totalHours: 0,
      estimatedHours: 0,
      completionRate: 0,
      hoursEfficiency: 0,
      weeklyVelocity: 0,
      avgCycleTime: 0,
      trend: {
        total: 0,
        completionRate: 0
      },
      priorityDistribution: {
        low: 0,
        medium: 0,
        high: 0,
        urgent: 0
      }
    };
  }
}