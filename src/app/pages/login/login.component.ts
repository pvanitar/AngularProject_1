import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Login,  SignUp } from '../../Models/classes/login';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ILoginResponse } from '../../Models/interfaces/ILoginResponse';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  // Inject HttpClient
  http = inject(HttpClient);
  router=inject(Router);  

  loginObj: Login = new Login();

  signup = new FormGroup({
    UserName: new FormControl('', [Validators.required]),
    EmailId: new FormControl('', [Validators.required, Validators.email]),
    Mobile: new FormControl('', [Validators.required]),
    Password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  onSignUp() {
    debugger;
    if (this.signup.valid) {
      const signUpData = {
        UserName: this.signup.value.UserName,
        EmailId: this.signup.value.EmailId,
        Mobile: this.signup.value.Mobile,
        Password: this.signup.value.Password
      };
    
      this.http.post<ILoginResponse>(`${environment.apiUrl}/api/User/signup`, signUpData).pipe(
        catchError(this.handleError)
      ).subscribe(
        (response) => {
          if (response.message === "User created successfully") {
            this.router.navigateByUrl('login');
          } else {
            this.router.navigateByUrl('login');
          }
        },
        (error) => {
          this.router.navigateByUrl('login');
        }
      );
    } else {
      console.log('Form is invalid!');
    }
  }

  onLogin() {
    const loginData = { EmailId: this.loginObj.EmailId, Password: this.loginObj.Password };

    this.http.post<ILoginResponse>(`${environment.apiUrl}/api/User/login`, loginData).pipe(
      catchError(this.handleError)
    ).subscribe(
      (response) => {
        if (response.message === "Login successful") {
          localStorage.setItem('token', response.token);
          this.router.navigateByUrl('dashboard');
        } else {
          this.router.navigateByUrl('login');
        }
      },
      (error) => {
        this.router.navigateByUrl('login');
      }
    );
  }

  // Handle errors from the HTTP request
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, body was: `, error.error);
    }
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}
