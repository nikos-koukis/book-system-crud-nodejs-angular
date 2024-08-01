import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { CartService } from '../../../services/cart.service'; 
import { Router } from '@angular/router';

interface Book {
  title: string;
  isbn: string;
  image?: string; 
  stock: number;
}

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  books: Book[] = [];
  serverError: string = '';

  constructor(private apiService: ApiService, private cartService: CartService, private router: Router) {}

  private apiUrl = 'http://localhost:80';

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.apiService.getBooks(token).subscribe(
        response => {
          this.books = response.map(book => {
            const cookieBook = this.cartService.getCartItem(book.isbn); // Get cart item info from CartService
            if (cookieBook) {
              book.stock -= cookieBook.quantity; // Reduce stock by the quantity in cart
            }
            return {
              ...book,
              image: `${this.apiUrl}/${book.image}`
            };
          });
        },
        error => {
          console.error('Failed to fetch books', error);
          this.serverError = error.error.message || 'An unexpected error occurred.';
        }
      );
    } else {
      this.serverError = 'User is not authenticated.';
      this.router.navigate(['/login']);
    }
  }

  buyBook(book: Book): void {
    if (book.stock > 0) {
      this.cartService.addToCart(book);
      book.stock -= 1; // Decrement the stock after adding to the cart
      alert(`You have added ${book.title} to your cart.`);
    } else {
      alert(`Sorry, ${book.title} is out of stock!`);
    }
  }
}
