import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { IUser } from '../../Models/interfaces/IUser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  http = inject(HttpClient);
  userList: IUser[] = [];

  ngOnInit(): void {
    this.http.get<IUser[]>(`${environment.apiUrl}/api/User`).subscribe(
      (res: IUser[]) => {
        this.userList = res;
      },
      (error) => {
        console.error('Error fetching user list', error);
      }
    );
  }
}
