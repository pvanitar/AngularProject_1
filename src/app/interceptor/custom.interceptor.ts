import { HttpInterceptorFn } from '@angular/common/http';
import { NotificationService } from '../Service/notification.service';
import { inject } from '@angular/core';
import { catchError,throwError } from 'rxjs';

export const customInterceptor: HttpInterceptorFn = (req, next) => {
  const token=localStorage.getItem('token');
  const notificationService = inject(NotificationService);
debugger;
  if (token) {
    const cloneReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(cloneReq).pipe(
      catchError((error) => {
        // Handle the error globally
        if (error.status === 0) {
          notificationService.showNotification('Network error occurred. Please try again later.', 'error');
        } else {
          notificationService.showNotification(`Error: ${error.message}`, 'error');
        }
        return throwError(error);
      })
    );
  } 
  // If no token, just forward the original request without modification
  return next(req).pipe(
    catchError((error) => {
      if (error.status === 0) {
        notificationService.showNotification('Network error occurred. Please try again later.', 'error');
      } else {
        notificationService.showNotification(`Error: ${error.message}`, 'error');
      }
      return throwError(() => error);
    })
  );
};
