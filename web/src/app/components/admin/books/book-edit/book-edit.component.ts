import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-book-edit',
  templateUrl: './book-edit.component.html',
  styleUrls: ['./book-edit.component.css']
})
export class BookEditComponent implements OnInit {
  bookId: string = '';
  title: string = '';
  isbn: string = '';
  price: number = 0;
  stock: number = 0;
  image: File | null = null; // Property to hold the uploaded image file
  imagePreview: string | null = null; // Property for image preview
  serverError: string = '';

  constructor(private apiService: ApiService, private route: ActivatedRoute, private router: Router) {}

  private apiUrl = environment.apiUrl;

  ngOnInit(): void {
    this.bookId = this.route.snapshot.paramMap.get('id')!; // Get the ID from the route parameters
    this.getBookData(); // Fetch the book data
  }

  getBookData(): void {
    const token = localStorage.getItem('token'); // Retrieve the token from local storage
    if (token) {
      this.apiService.getBookById(this.bookId, token).subscribe(
        response => {
          this.title = response.title; // Set the title based on the response
          this.isbn = response.isbn; // Set the ISBN based on the response
          this.price = response.price; // Set the ISBN based on the response
          this.stock = response.stock; // Set the ISBN based on the response
          this.imagePreview = `${this.apiUrl}/${response.image}`; // Set the preview image path if available
          
        },
        error => {
          this.serverError = error.error.message || 'An unexpected error occurred.';
        }
      );
    } else {
      this.serverError = 'User is not authenticated.';
      this.router.navigate(['admin/books']);
    }
  }

  onImageSelected(event: any): void {
    this.image = event.target.files[0]; // Get the selected file
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreview = e.target.result; // Set the preview URL
    };
    reader.readAsDataURL(this.image as Blob); // Read the file as a data URL
  }

  updateBook(): void {
    const updatedBook = {
      title: this.title,
      isbn: this.isbn,
      stock: this.stock,
      // Remove image from here; it'll be handled in FormData
    };

    const token = localStorage.getItem('token'); // Retrieve the token
    const formData = new FormData(); // Create a FormData object to handle file upload
    formData.append('title', updatedBook.title); // Add title to FormData
    formData.append('isbn', updatedBook.isbn); // Add ISBN to FormData
    formData.append('price', this.price.toString()); // Add price to FormData
    formData.append('stock', updatedBook.stock.toString()); // Add stock to FormData

    // Only append the image if it exists
    if (this.image) {
      formData.append('image', this.image); // Add the selected image to FormData
    }

    if (token) {
      this.apiService.updateBook(this.bookId, formData, token).subscribe(
        response => {
          this.router.navigate(['admin/books']); // Redirect to the books list after updating
        },
        error => {
          this.serverError = error.error.message || 'An unexpected error occurred.';
        }
      );
    } else {
      this.serverError = 'User is not authenticated.';
      this.router.navigate(['/login']); // Redirect to login if not authenticated
    }
  }
}
