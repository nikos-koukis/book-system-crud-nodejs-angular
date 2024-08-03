import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';

// Interfaces to define the structure of data being used
interface Book {
  id: {
    title: string;
  };
  quantity: number;
}

interface User {
  id: {
    email: string;
  };
}

interface Order {
  _id: string;
  user: User;
  status: string;
  createdAt: string;
  books: Book[];
}

interface OrdersResponse {
  orders: Order[];
}

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  orders: Order[] = []; // Array to hold orders
  serverError: string | null = null; // For error handling
  loading: boolean = true; // To track loading state

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.getOrders();
  }

  editOrder(orderID: string): void {
    this.router.navigate([`admin/order/${orderID}`]);
  }

  getOrders(): void {
    this.loading = true; // Set loading to true before the request
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    if (token) {
      this.apiService.getOrders(token).subscribe(
        (response: OrdersResponse) => { // Specify the type of response
          this.orders = response.orders; // Accessing orders property
          this.loading = false; // Turn off loading
        },
        error => {
          this.serverError = error.error.message || 'An unexpected error occurred.';
          this.loading = false; // Also turn off loading on error
        }
      );
    } else {
      this.serverError = 'User is not authenticated.';
      this.loading = false; // Ensure loading is set to false if no token
    }
  }

  deleteOrder(orderId: string): void {
    const token = localStorage.getItem('token');
    if(token) {
      this.apiService.deleteOrder(orderId, token).subscribe(
        () => {
          this.orders = this.orders.filter(order => order._id !== orderId);
        },
        error => {
          this.serverError = error.error.message || 'An unexpected error occurred.';
        }
      );
    }
  }
}
