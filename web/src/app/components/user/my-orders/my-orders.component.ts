import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from '../../auth/services/auth.service';

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
  orders: Order[] = []; // Store order data as an array of Order
  loading: boolean = true; // Loading state
  serverError: string | null = null; // Error message state
  private apiUrl = 'http://localhost:80'; // Base URL for image paths

  constructor(private authService: AuthService, private apiService: ApiService) { }

  ngOnInit(): void {
    this.getUserDetails();
  }

  getUserDetails(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.authService.getDashboard(token).subscribe(
        response => {
          this.userID._id = response.user._id;
          this.getOrdersbyUser(); // Fetch orders after user ID is set
        },
        error => {
          console.error('Error fetching user details', error);
          this.serverError = 'Failed to load user details.';
          this.loading = false; // Stop loading
        }
      );
    }
  }

  getOrdersbyUser(): void {
    const token = localStorage.getItem('token');
    if (token && this.userID._id) {
      this.apiService.getOrdersByUser(token, this.userID._id).subscribe(
        response => {
          this.orders = response.orders; // Store the orders from the response
          this.orders.forEach(order => {
            // Construct image URLs for books in each order
            order.books = order.books.map(book => ({
              ...book,
              id: { ...book.id, image: `${this.apiUrl}/${book.id.image}` }
            }));
          });
          this.loading = false; // Data loading completed
        },
        error => {
          console.error('Error fetching orders', error);
          this.serverError = 'Failed to load orders.';
          this.loading = false; // Stop loading
        }
      );
    }
  }
}
