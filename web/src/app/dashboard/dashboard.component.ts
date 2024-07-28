import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: any; // Variable to hold user data
  serverError: string = ''; // Variable to hold any errors

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.getDashboardData();
  }

  getDashboardData(): void {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage

    if (token) {
      this.authService.getDashboard(token).subscribe(
        response => {
          this.user = response.user; // Assuming the response contains user data
        },
        error => {
          console.error('Failed to fetch dashboard data', error);
          this.serverError = error.error.message || 'An unexpected error occurred.';
        }
      );
    } else {
      this.serverError = 'User is not authenticated.';
      // Optionally redirect to login or show a message
    }
  }
}
