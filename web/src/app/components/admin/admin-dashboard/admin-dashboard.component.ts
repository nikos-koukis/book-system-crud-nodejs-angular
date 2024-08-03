import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service'; // Adjust the import path accordingly


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  totalCustomers: number = 0;
  totalBooks: number = 0;
  totalOrders: number = 0;
  pendingOrders: number = 0;
  serverError: string = '';

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.getCounts();
  }

  getCounts(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.apiService.getStatistics(token).subscribe(
        response => {
          this.totalCustomers = response.totalCustomers || 0;
          this.totalBooks = response.totalBooks || 0;
          this.totalOrders = response.totalOrders || 0;
          this.pendingOrders = response.pendingOrders || 0;
        },
        error => {
          this.serverError = error.error.message || 'An unexpected error occurred.';
        }
      );
    }
  }

}
