import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { INotification } from '../Models/interfaces/INotification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<INotification>();
  notification$ = this.notificationSubject.asObservable();

  showNotification(message: string, type: 'success' | 'error' | 'failure') {
    this.notificationSubject.next({ message, type });
  }

  constructor() { }
}
