import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../../utils/toast.service';

// Interfaces to define the structure of data being used
interface Book {
  id: {
    title: string;
    price: number;
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
  finalPrice: number = 0;

  constructor(private apiService: ApiService, private router: Router, private toastService: ToastService) {}

  ngOnInit(): void {
    this.getOrders();
  }

  editOrder(orderID: string): void {
    this.router.navigate([`admin/order/${orderID}`]);
  }

  getOrders(): void {
    this.loading = true;
    const token = localStorage.getItem('token');
    if (token) {
      this.apiService.getOrders(token).subscribe(
        (response: OrdersResponse) => {
          this.orders = response.orders;
          this.calculateOrderTotal(this.orders[0]);
          this.loading = false;
        },
        error => {
          this.serverError = error.error.message || 'An unexpected error occurred.';
          this.loading = false;
        }
      );
    } else {
      this.serverError = 'User is not authenticated.';
      this.loading = false;
    }
  }

  calculateOrderTotal(order: Order): number {
    let total = 0;
    order.books.forEach(book => {
      total += book.id.price * book.quantity;
    });
    return total;
  }

  deleteOrder(orderId: string): void {
    const token = localStorage.getItem('token');
    if(token) {
      this.apiService.deleteOrder(orderId, token).subscribe(
        () => {
          setTimeout(() => {
            this.orders = this.orders.filter(order => order._id !== orderId);
            this.toastService.showToast('Order deleted successfully!', 'success'); // Show success toast
          }, 150);
        },
        error => {
          setTimeout(() => {
            this.toastService.showToast('Cannot delete order!', 'error');
            this.serverError = error.error.message || 'An unexpected error occurred.';
          }, 150);
        }
      );
    }
  }
}
