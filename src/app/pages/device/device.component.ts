import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { IDevice } from '../../Models/interfaces/IDevice';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-device',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './device.component.html',
  styleUrl: './device.component.css'
})
export class DeviceComponent implements OnInit {

  http = inject(HttpClient);
  deviceList: IDevice[] = [];

  ngOnInit(): void {
    this.http.get<IDevice[]>(`${environment.apiUrl}/api/User`).subscribe(
      (res: IDevice[]) => {
        this.deviceList = res;
      },
      (error) => {
        console.error('Error fetching device list', error);
      }
    );
  }
}
