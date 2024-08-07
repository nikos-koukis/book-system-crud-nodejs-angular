import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { ToastService } from '../../../../utils/toast.service';
@Component({
  selector: 'app-book-create',
  templateUrl: './book-create.component.html',
  styleUrls: ['./book-create.component.css']
})
export class BookCreateComponent implements OnInit {
  title: string = '';
  isbn: string = '';
  price: number = 0;
  stock: number = 0;
  image: File | null = null; // Property to hold the uploaded image file
  imagePreview: string | null = null; // Property for image preview
  serverError: string = '';

  constructor(private apiService: ApiService, private router: Router, private toastService: ToastService) { }

  ngOnInit(): void {
    // Any initialization logic can be added here if necessary
  }

  onImageSelected(event: any): void {
    this.image = event.target.files[0]; // Get the selected file
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreview = e.target.result; // Set the preview URL
    };
    reader.readAsDataURL(this.image as Blob); // Read the file as a data URL
  }

  createBook(): void {


    if (!this.title || !this.isbn || !this.price || this.stock === null || !this.image) {
      this.serverError = 'Please fill in all required fields correctly.';
      return;
    }

    if (this.stock < 0) {
      this.serverError = 'Stock cannot be a negative number.';
      return;
    }

    const newBook = {
      title: this.title,
      isbn: this.isbn,
      stock: this.stock,
      price: this.price
    };

    const token = localStorage.getItem('token'); // Retrieve the token
    const formData = new FormData(); // Create a FormData object to handle file upload
    formData.append('title', newBook.title); // Add title to FormData
    formData.append('isbn', newBook.isbn); // Add ISBN to FormData
    formData.append('price', newBook.price.toString()); // Add price to FormData
    formData.append('stock', newBook.stock.toString()); // Add stock to FormData

    // Only append the image if it exists
    if (this.image) {
      formData.append('image', this.image); // Add the selected image to FormData
    }

    if (token) {
      this.apiService.createBook(formData, token).subscribe(
        response => {
          setTimeout(() => {
            this.toastService.showToast('Book created successfully!', 'success'); // Show success toast
          }, 150);
          this.router.navigate(['admin/books']); // Redirect to the books list after creating
        },
        error => {
          setTimeout(() => {
            if(error.status == 400){
              this.toastService.showToast('Isbn already exists', 'error');
            }else{
              this.toastService.showToast('Error at creating book!', 'error'); // Show error toast
            }
          }, 100);
        }
      );
    } else {
      this.serverError = 'User is not authenticated.';
      this.router.navigate(['/login']); // Redirect to login if not authenticated
    }
  }
}
