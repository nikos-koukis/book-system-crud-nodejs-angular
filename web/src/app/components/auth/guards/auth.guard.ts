// auth.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {

    const token = localStorage.getItem('token');
    if (!token) {
      // If there's no token, redirect to login
      this.router.navigate(['/login']);
      return of(false); // Return an observable of false
    }

    // Call getDashboard to check role
    return this.authService.getDashboard(token).pipe(
      tap(response => {
        const role = response.user.role; // Access user role directly from the response
        const isAdminRoute = state.url.startsWith('/admin');
        const isUserRoute = state.url.startsWith('/dashboard');

        if (role === 'admin' && isUserRoute) {
          // If the user is admin, they shouldn't access the user dashboard
          this.router.navigate(['/admin/dashboard']); // Redirect to admin dashboard or a not-authorized page
        } else if (role === 'user' && isAdminRoute) {
          // If the user is a regular user, they shouldn't access the admin routes
          this.router.navigate(['/dashboard']); // Redirect to user dashboard or a not-authorized page
        }
      }),
      catchError(() => {
        // Handle error case (e.g., token has expired, etc.)
        this.router.navigate(['/login']);
        return of(false);
      }),
      // If no redirects occurred, we will allow access
      tap(() => true)
    );
  }
}
