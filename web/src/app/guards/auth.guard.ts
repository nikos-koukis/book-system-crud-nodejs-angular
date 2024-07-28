import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode to validate the token

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('token');

    // If the user is trying to access login or register routes
    if (route.url.some(segment => segment.path === 'login' || segment.path === 'register')) {
      if (token) {
        try {
          // Decode the token to check its validity
          const decodedToken: any = jwtDecode(token);

          // Check if the token has expired
          if (decodedToken.exp * 1000 > Date.now()) {
            // If the token is valid, redirect to dashboard
            this.router.navigate(['/dashboard']);
            return false; // Deny access to login/register
          }
        } catch (error) {
          console.warn('Invalid token', error);
          localStorage.removeItem('token'); // Remove invalid token
        }
      }
      // Allow access to login and register routes if no token is present
      return true;
    }

    // If there is a token, check if it is valid
    if (token) {
      try {
        // Decode the token to check its validity
        const decodedToken: any = jwtDecode(token);

        // Check if the token has expired
        if (decodedToken.exp * 1000 < Date.now()) {
          localStorage.removeItem('token'); // Remove expired token
          this.router.navigate(['/login']); // Redirect to login page
          return false; // Deny access
        }

        // Allow access if token is valid
        return true;
      } catch (error) {
        console.warn('Invalid token', error);
        localStorage.removeItem('token'); // Remove invalid token
        this.router.navigate(['/login']);
        return false; // Deny access
      }
    }

    // If no token and trying to access a protected route, redirect to login
    this.router.navigate(['/login']);
    return false; // Deny access
  }
}
