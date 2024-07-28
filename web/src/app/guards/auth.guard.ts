import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        // Decode the token to check its validity
        const decodedToken: any = jwtDecode(token);
        
        // Check if the token has expired
        if (decodedToken.exp * 1000 < Date.now()) {
          throw new Error('Token has expired');
        }

        return true; // Allow access
      } catch (error) {
        console.warn('Invalid token or token expired', error);
        localStorage.removeItem('token'); // Remove invalid token
      }
    }

    this.router.navigate(['/login']); // Redirect to login if token is invalid or missing
    return false; // Deny access
  }
}
