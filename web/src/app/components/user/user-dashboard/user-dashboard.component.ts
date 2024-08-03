import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../utils/toast.service';
import { environment } from 'src/environments/environment';
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

  constructor(private apiService: ApiService, private router: Router, private toastService: ToastService) {}

  private apiUrl = environment.apiUrl;

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.apiService.getBooks(token).subscribe(
        response => {
          this.books = response.map(book => {
            return {
              ...book,
              image: `${this.apiUrl}/${book.image}`
            };
          });
        },
        error => {
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
    setTimeout(() => {
      this.toastService.showToast(`Book "${book.title}" added to cart`, 'success');
    }, 150);
}

  removeFromCart(book: Book): void {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart = cart.filter((item: Book) => item.isbn !== book.isbn);
    localStorage.setItem('cart', JSON.stringify(cart));
    setTimeout(() => {
      this.toastService.showToast(`Book "${book.title}" removed from cart`, 'success');
    }, 150);
  }

  isInCart(book: Book): boolean {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    return cart.some((item: Book) => item.isbn === book.isbn);
  }
}
