import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<any>();
  
  notifications$ = this.notificationSubject.asObservable();
  
  showNotification(message: string, type: 'success' | 'error' | 'info') {
    this.notificationSubject.next({ message, type });
  }
}