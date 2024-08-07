import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {
  customers: any[] = [];
  serverError: string = '';
  editingCustomerId: string | null = null;
  updatedCustomer: any = {};
  isLoading: boolean = false;
  orderCounts: { [key: string]: number } = {};
  totalPrices: { [key: string]: number } = {};

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.getCustomers();
  }

  getCustomers(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.isLoading = true;
      this.apiService.getCustomers(token).subscribe(
        response => {
          this.customers = response;
          this.isLoading = false;
          this.getOrderCounts(response, token);
          this.getTotalPrices(response, token);
        },
        error => {
          this.isLoading = false;
        }
      );
    } else {
      this.router.navigate(['/login']);
    }
  }

  getOrderCounts(customers: any[], token: string): void {
    customers.forEach(customer => {
      if (customer._id) {
        this.apiService.getOrderCountByUserId(customer._id, token).subscribe(
          response => {
            this.orderCounts[customer._id] = response.orderCount;
          }
        );
      }
    });
  }

  getTotalPrices(customers: any[], token: string): void {
    customers.forEach(customer => {
      if (customer._id) {
        console.log(customer._id)
        this.apiService.getTotalPriceByUserId(customer._id, token).subscribe(
          response => {
            console.log(response)
            this.totalPrices[customer._id] = response.totalPrice;
          }
        );
      }
    });
  }
}
