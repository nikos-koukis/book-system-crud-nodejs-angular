// auth.service.ts

import { Injectable, isDevMode, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthService{
  private apiUrl = environment.apiUrl + '/api';
  private userRole: string | null = null; // Add a property to store user role

  constructor(private http: HttpClient, private router: Router) { }


  // Registration method
  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, user);
  }

  // Login method
  login(credentials: { email: string; password: string }): Observable<any> {
    console.log(this.apiUrl)
    return this.http.post(`${this.apiUrl}/auth/login`, credentials);
  }

  // Method to get dashboard data
  getDashboard(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/dashboard`, { headers }).pipe(
      tap((response) => {
        // Store user role when fetching dashboard data
        this.userRole = response.user.role; // Assuming the user's role is here
      })
    );
  }

  // Check user role
  getUserRole(): string | null {
    return this.userRole;
  }

  // Logout method
  logout(): void {
    localStorage.removeItem('token');
    this.userRole = null; // Reset user role on logout
    this.router.navigate(['/login']);
  }
}
