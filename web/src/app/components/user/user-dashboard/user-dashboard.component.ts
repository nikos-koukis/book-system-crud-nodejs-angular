import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';

interface Book {
  title: string;
  isbn: string;
  price: number;
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

  constructor(private apiService: ApiService, private router: Router) {}

  private apiUrl = 'http://localhost:80';

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.apiService.getBooks(token).subscribe(
        response => {
          console.log('Books fetched successfully', response);
          this.books = response.map(book => {
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

  addToCart(book: Book): void {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push(book);
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  removeFromCart(book: Book): void {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart = cart.filter((item: Book) => item.isbn !== book.isbn); // assuming isbn is unique
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  isInCart(book: Book): boolean {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    return cart.some((item: Book) => item.isbn === book.isbn);
  }
}
