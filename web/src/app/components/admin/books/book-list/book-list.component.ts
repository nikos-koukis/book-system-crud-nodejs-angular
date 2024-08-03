import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ToastService } from '../../../../utils/toast.service';
@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  books: any[] = []; // Array to hold book data
  serverError: string = ''; // Variable to hold error messages

  constructor(private apiService: ApiService, private router: Router, private toastService: ToastService) {}

  private apiUrl = environment.apiUrl;

  ngOnInit(): void {
    this.getBooks();
  }

  getBooks(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.apiService.getBooks(token).subscribe(
        response => {
          this.books = response.map(book => ({
            ...book,
            image: `${this.apiUrl}/${book.image}`
          }));
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

  // Method to navigate to the edit page for a specific book
  editBook(bookId: string): void {
    this.router.navigate([`admin/books/${bookId}`]);
  }

  deleteBook(bookId: string): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.apiService.deleteBook(bookId, token).subscribe(
        response => {
          this.getBooks();
        },
        error => {
          this.serverError = error.error.message || 'An unexpected error occurred.';
        }
      );
      setTimeout(() => {
        this.books = this.books.filter(book => book._id !== bookId); // Simulate book deletion
        this.toastService.showToast('Book deleted successfully!', 'success'); // Show success toast
      }, 150); // Simulate service response delay
    } else {
      this.serverError = 'User is not authenticated.';
      this.router.navigate(['/login']);
    }
  }

  testToast(): void {
    this.toastService.showToast('This is a test message!', 'success');
  }

  createNewBook(): void {
    this.router.navigate(['/admin/book/add']);
  }
}
