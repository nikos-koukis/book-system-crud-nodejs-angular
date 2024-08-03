import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (token) {

      const decodedToken: any = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Current time in seconds
      if (decodedToken.exp < currentTime) {
        localStorage.removeItem('token'); // Remove token from local storage
        return of(true); // Allow access to the route
      }
      // If token exists, redirect to dashboard or appropriate route
      this.router.navigate(['/dashboard']); // Redirect to user dashboard or admin dashboard
      return of(false); // Prevent access to the route
    }
    return of(true); // Allow access to the route if not logged in
  }
}
