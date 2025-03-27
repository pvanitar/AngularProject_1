import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { IUser } from '../../Models/interfaces/IUser';
import { CommonModule } from '@angular/common';
import { IDevice } from '../../Models/interfaces/IDevice';
import { Chart, LinearScale, BarElement, CategoryScale, Title, Tooltip, Legend,BarController, DoughnutController, PieController,ArcElement } from 'chart.js';

// Register necessary chart types
Chart.register(LinearScale, BarElement, CategoryScale, Title, Tooltip, Legend,BarController, DoughnutController, PieController,ArcElement);


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
  deviceList: IDevice[] = [];

  chart!:Chart;
  deviceChart!: Chart;

  ngOnInit(): void {
    //fetch user data
    this.http.get<IUser[]>(`${environment.apiUrl}/api/User/users`).subscribe(
      (res: IUser[]) => {
        this.userList = res;
        this.updateChartData();
      },
      (error) => {
        console.error('Error fetching user list', error);
      }
    );

    // Fetch device data
    this.http.get<IDevice[]>(`${environment.apiUrl}/api/User/users`).subscribe(
      (res: IDevice[]) => {
        this.deviceList = res;
        this.updateDeviceChartData();
      },
      (error) => {
        console.error('Error fetching device list', error);
      }
    );
  }

  updateChartData(): void {
    debugger;
    // Count the number of active and inactive users
    const activeUsers = this.userList.filter(user => user.status).length;
    const inactiveUsers = this.userList.length - activeUsers;

    // Initialize the chart (or update it if it already exists)
    if (this.chart) {
      this.chart.destroy(); // Destroy the existing chart before re-creating
    }

    // Create a new chart
    this.chart = new Chart('userChart', {
      type:"bar",
      data: {
        labels: ['Active', 'Inactive'], // Labels for the chart
        datasets: [{
          label: 'User Status',
          data: [activeUsers, inactiveUsers], // Data for the chart
          backgroundColor: ['#4caf50', '#f44336'], // Colors for the bars
          borderColor: ['#388e3c', '#d32f2f'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true // Uses LinearScale for the Y-axis, ensuring it starts at zero
          }
        },
        plugins: {
          title: {
            display: true, // Displays the Title plugin
            text: 'User Status Chart'
          },
          tooltip: {
            enabled: true // Enables the Tooltip plugin
          },
          legend: {
            display: true // Enables the Legend plugin
          }
        }
      }
    });
  }

  updateDeviceChartData(): void {
    const deviceCount: Record<string, number> = {};

    this.deviceList.forEach(device => {
      const type = device.ConnectionType;
      deviceCount[type] = (deviceCount[type] || 0) + 1;
    });

    const deviceLabels = Object.keys(deviceCount);
    const deviceData = Object.values(deviceCount);

    if (this.deviceChart) {
      this.deviceChart.destroy(); // Destroy the existing chart before re-creating
    }

    // Create a new chart for device types (using pie chart)
    this.deviceChart = new Chart('deviceChart', {
      type: 'pie', // Pie chart for devices
      data: {
        labels: deviceLabels, // Device types as labels
        datasets: [{
          label: 'Device Connection Types',
          data: deviceData, // Device counts for each type
          backgroundColor: ['#ff9900', '#ff6600', '#ff3333', '#33cc33', '#3399ff'], // Pie chart slice colors
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Device Connection Type Distribution'
          },
          tooltip: {
            enabled: true
          },
          legend: {
            display: true
          }
        }
      }
    });
  }
}