import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { IUser } from '../../Models/interfaces/IUser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {

  http = inject(HttpClient);
  userList: IUser[] = [];
  editingUserIds: Set<number> = new Set<number>(); 
  filteredUserList: IUser[] = [];
  p: number = 1;
  pageSize: number = 5;
  totalUsers: number = 0;
  totalPages: number = 1;
  searchText: string = '';

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.http.get<{ users: IUser[], totalCount: number, totalPages: number }>(`${environment.apiUrl}/api/User/usersWithPagi`, {
      params: {
        pageNumber: this.p.toString(),
        pageSize: this.pageSize.toString(),
      }
    }).subscribe(
      (res) => {
        this.userList = res.users;
        this.totalUsers = res.totalCount; 
        this.totalPages = res.totalPages; 
        this.applySearchFilter();
      },
      (error) => {
        console.error('Error fetching user list', error);
      }
    );
  }
  
  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.p = page;
    this.loadUsers();  // Fetch users for the new page
  }

  isEditing(userId: number): boolean {
    return this.editingUserIds.has(userId);
  }

  toggleEditStatus(user: IUser): void {
    if (this.isEditing(user.id)) {
      this.saveStatus(user);
    } else {
      this.editingUserIds.add(user.id);
    }
  }

 saveStatus(user: IUser): void {
  const updatedStatus = { Status: user.status ? true : false };

    this.http.put(`${environment.apiUrl}/api/User/${user.id}/status`, updatedStatus).subscribe(
      (res) => {
        console.log('User status updated successfully', res);
        this.editingUserIds.delete(user.id);
      },
      (error) => {
        console.error('Error updating user status', error);
        this.editingUserIds.delete(user.id);
      }
    );
  }

  onSearchChange(): void {
    this.p = 1;
    this.applySearchFilter();
  }

  applySearchFilter(): void {
    if (this.searchText) {
      this.filteredUserList = this.userList.filter((user) => 
        user.userName.toLowerCase().includes(this.searchText.toLowerCase()) ||
        user.emailId.toLowerCase().includes(this.searchText.toLowerCase())
      );
    } else {
      this.filteredUserList = [...this.userList];
    }
    this.totalPages = Math.ceil(this.filteredUserList.length / this.pageSize);
  }
  getFilteredUserList(): IUser[] {
    const start = (this.p - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredUserList.slice(start, end);
  }
}
