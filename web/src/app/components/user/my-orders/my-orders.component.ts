import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from '../../auth/services/auth.service';
import { environment } from 'src/environments/environment';
interface Book {
  id: {
    _id: string;
    title: string;
    isbn: string;
    price: number;
    image: string;
  };
  quantity: number;
  _id: string;
}

interface Order {
  _id: string;
  user: {
    id: {
      _id: string;
      username: string;
      email: string;
    };
  };
  status: string;
  createdAt: string;
  updatedAt: string;
  books: Book[];
}

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {
  userID: { _id: string; } = { _id: '' };
  orders: Order[] = [];
  loading: boolean = true;
  serverError: string | null = null;
  selectedOrder: Order | null = null; // Hold the selected order
  isModalOpen: boolean = false; // Modal visibility state
  private apiUrl = environment.apiUrl;

  constructor(private authService: AuthService, private apiService: ApiService) {}

  ngOnInit(): void {
    this.getUserDetails();
  }

  getUserDetails(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.authService.getDashboard(token).subscribe(
        response => {
          this.userID._id = response.user._id;
          this.getOrdersbyUser();
        },
        error => {
          console.error('Error fetching user details', error);
          this.serverError = 'Failed to load user details.';
          this.loading = false;
        }
      );
    }
  }

  getOrdersbyUser(): void {
    const token = localStorage.getItem('token');
    if (token && this.userID._id) {
      this.apiService.getOrdersByUser(token, this.userID._id).subscribe(
        response => {
          this.orders = response.orders;
          this.orders.forEach(order => {
            order.books = order.books.map(book => ({
              ...book,
              id: { ...book.id, image: `${this.apiUrl}/${book.id.image}` }
            }));
          });
          this.loading = false;
        },
        error => {
          this.loading = false;
        }
      );
    }
  }
  
  openOrderDetailsModal(order: Order): void {
    this.selectedOrder = order; // Set the selected order
    this.isModalOpen = true; // Open the modal
  }

  closeModal(): void {
    this.isModalOpen = false; // Close the modal
    this.selectedOrder = null; // Clear the selected order
  }
}
