import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { IDevice } from '../../Models/interfaces/IDevice';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationService } from '../../Service/notification.service';

@Component({
  selector: 'app-device',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './device.component.html',
  styleUrl: './device.component.css'
})
export class DeviceComponent implements OnInit {

  http = inject(HttpClient);
  notificationService=inject(NotificationService);

  deviceList: IDevice[] = [];
  isFormVisible: boolean = false;

  deviceForm=new FormGroup({
      DeviceName:new FormControl('', [Validators.required]),
      IPAddress:new FormControl('', [Validators.required]),
      DeviceGroup: new FormControl('', [Validators.required]),
      ConnectionType:new FormControl('', [Validators.required]),
      Port: new FormControl(0, [Validators.required, Validators.min(1)]),
      Price: new FormControl(0, [Validators.required, Validators.min(0)]),
      Status:new FormControl(true)
  });

  currentDeviceId: number | null = null;
  formTitle: string = 'Add Device';

  ngOnInit(): void {
    this.loadDevices();
  }

  loadDevices(): void {
    this.http.get<IDevice[]>(`${environment.apiUrl}/api/Device`).subscribe(
      (res: any[]) => {
        // Map the API response to match the IDevice interface
        this.deviceList = res.map((device: any) => ({
          id: device.id,
          DeviceName: device.deviceName, 
          IPAddress: device.ipAddress,   
          DeviceGroup: device.deviceGroup, 
          ConnectionType: device.connectionType, 
          Port: device.port,            
          Price: device.price,          
          Status: device.status         
        }));
      },
      (error) => {
        console.error('Error fetching device list', error);
      }
    );
  }

  editDevice(device: IDevice): void {
    this.currentDeviceId = device.id;
    this.formTitle = 'Edit Device'; 
    this.deviceForm.setValue({
      DeviceName: device.DeviceName,
      IPAddress: device.IPAddress,
      DeviceGroup: device.DeviceGroup,
      ConnectionType: device.ConnectionType,
      Port: device.Port,
      Price: device.Price,
      Status: device.Status
    });
  
    this.isFormVisible = true;
  }

  deleteDevice(deviceId: number): void {
    const confirmation = window.confirm("Are you sure you want to delete this device?");
    if (confirmation) {
      this.http.delete(`${environment.apiUrl}/api/Device/${deviceId}`).subscribe(
        () => {
          this.deviceList = this.deviceList.filter(device => device.id !== deviceId);
          this.notificationService.showNotification('Device deleted successfully!', 'success');
        },
        (error) => {
          console.error('Error deleting device', error);
          this.notificationService.showNotification('Failed to delete device.', 'error');
        }
      );
    }
  }
  

  openForm(): void {
    this.formTitle = 'Add Device';
    this.deviceForm.reset();
    this.currentDeviceId = null;
    this.isFormVisible = true;
  }

  closeForm(event: any): void {
    if (event.target === event.currentTarget) {
      this.isFormVisible = false;
    }
  }

  onSubmit(): void {
    if (this.deviceForm.valid) {
      const formData = this.deviceForm.value;

      if (this.currentDeviceId) {
        // Edit device via PUT request to the API
        this.http.put(`${environment.apiUrl}/api/Device/${this.currentDeviceId}`, formData).subscribe(
          (res) => {
            console.log('Device updated successfully', res);
            this.loadDevices();
            this.resetForm();
          },
          (error) => {
            console.error('Error updating device', error);
          }
        );
      } else {
        // Add new device via POST request to the API
        this.http.post(`${environment.apiUrl}/api/Device`, formData).subscribe(
          (res) => {
            console.log('Device added successfully', res);
            this.loadDevices();
            this.resetForm();
          },
          (error) => {
            console.error('Error adding device', error);
          }
        );
      }
    } else {
      this.showFormErrors();
    }
  }


  resetForm(): void {
    this.deviceForm.reset();
    this.currentDeviceId = null;
    this.isFormVisible=false;
  }

  showFormErrors() {
    Object.keys(this.deviceForm.controls).forEach(key => {
      const control = this.deviceForm.get(key);
      if (control && control.invalid && control.touched) {
        this.notificationService.showNotification(
          `${this.getFieldName(key)} is required.`,
          'error'
        );
      }
    });
  }

  getFieldName(field: string): string {
    const fieldNames: { [key: string]: string } = {
      DeviceName: 'Device Name',
      IPAddress: 'IP Address',
      DeviceGroup: 'Device Group',
      ConnectionType: 'Connection Type',
      Port: 'Port',
      Price: 'Price',
      Status: 'Status'
    };
    return fieldNames[field] || field;
  }
}
