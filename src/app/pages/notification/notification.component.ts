import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../Service/notification.service';
import { CommonModule } from '@angular/common';
import { INotification } from '../../Models/interfaces/INotification';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent implements OnInit {
  notification: INotification | null = null;

  constructor(private notificationService:NotificationService){}
  ngOnInit(): void {
    this.notificationService.notification$.subscribe(notification=>{
    this.notification=notification;
    setTimeout(() => {
      this.notification = null;
    }, 3000);
    })
  }
}
