import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  books: any[] = []; // Array to hold book data
  serverError: string = ''; // Variable to hold error messages

  constructor(private apiService: ApiService, private router: Router) {}

  private apiUrl = 'http://localhost:80';

  ngOnInit(): void {
    this.getBooks();
  }

  getBooks(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.apiService.getBooks(token).subscribe(
        response => {
          // Assuming response returns an array of books
          this.books = response.map(book => ({
            ...book,
            // Prefix the image path based on your API static file serving configuration
            image: `${this.apiUrl}/${book.image}`
          }));
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

  // Method to navigate to the edit page for a specific book
  editBook(bookId: string): void {
    this.router.navigate([`admin/books/edit/${bookId}`]);
  }

  deleteBook(bookId: string): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.apiService.deleteBook(bookId, token).subscribe(
        response => {
          // Assuming response returns a success message
          console.log('Book deleted successfully', response);
          this.getBooks();
        },
        error => {
          console.error('Failed to delete book', error);
          this.serverError = error.error.message || 'An unexpected error occurred.';
        }
      );
    } else {
      this.serverError = 'User is not authenticated.';
      this.router.navigate(['/login']);
    }
  }
}
