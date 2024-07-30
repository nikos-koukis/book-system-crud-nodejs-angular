import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service'; // Adjust the import path as needed
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  serverError: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    const credentials = {
      email: this.email,
      password: this.password
    };

    this.authService.login(credentials).subscribe(
      response => {
        localStorage.setItem('token', response.token); // Store JWT token
        // Fetch dashboard data to get user role
        this.authService.getDashboard(response.token).subscribe(dashboardResponse => {
          const userRole = dashboardResponse.user.role; // Get user role

          // Redirect to the appropriate dashboard based on role
          if (userRole === 'admin') {
            this.router.navigate(['/admin/dashboard']); // Redirect to admin dashboard
          } else {
            this.router.navigate(['/dashboard']); // Redirect to user dashboard
          }
        }, error => {
          console.error('Failed to fetch user dashboard', error);
          this.serverError = 'Failed to fetch user information. Please try again.';
        });
      },
      error => {
        console.error('Login failed', error);
        this.serverError = error.error.message || 'Login failed. Please try again.';
      }
    );
  }
}
