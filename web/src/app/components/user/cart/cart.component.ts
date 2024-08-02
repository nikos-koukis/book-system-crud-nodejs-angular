import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';

interface Book {
    title: string;
    isbn: string;
    price: number;
    image?: string;
    stock: number;
    quantity: number; // Include quantity in the Book interface
}

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
    cartItems: Book[] = [];
    userDetails: { email: string;} = { email: ''};

    constructor(private authService: AuthService) {}

    ngOnInit(): void {
        this.loadCart();
        this.getUserDetails();
    }

    loadCart(): void {
        this.cartItems = JSON.parse(localStorage.getItem('cart') || '[]').map((item: Book) => {
            return {
                ...item,
                quantity: item.quantity || 1 // Restore previous quantity if available, else initialize to 1
            };
        });
    }

    getTotal(): number {
        return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    removeFromCart(index: number): void {
        this.cartItems.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(this.cartItems));
    }

    increaseQuantity(book: Book): void {
        const bookIndex = this.cartItems.findIndex(item => item.isbn === book.isbn);
        if (bookIndex !== -1 && this.cartItems[bookIndex].quantity < this.cartItems[bookIndex].stock) {
            this.cartItems[bookIndex].quantity += 1; // Increase quantity
            localStorage.setItem('cart', JSON.stringify(this.cartItems)); // Update local storage
        }
    }

    decreaseQuantity(book: Book): void {
        const bookIndex = this.cartItems.findIndex(item => item.isbn === book.isbn);
        if (bookIndex !== -1 && this.cartItems[bookIndex].quantity > 1) {
            this.cartItems[bookIndex].quantity -= 1; // Decrease quantity
            localStorage.setItem('cart', JSON.stringify(this.cartItems)); // Update local storage
        }
    }

    clearCart(): void {
        this.cartItems = []; // Clear the array in the component
        localStorage.removeItem('cart'); // Clear cart in local storage
    }


    getUserDetails(): void {
      const token = localStorage.getItem('token');
      if (token) {
          this.authService.getDashboard(token).subscribe(
              response => {
                  this.userDetails.email = response.user.email; 
              },
              error => {
                  console.error('Failed to fetch user details', error);
              }
          );
      }
  }

    submitOrder(): void {
        if (this.userDetails.email) {
            localStorage.removeItem('cart');
            this.cartItems = [];
            window.location.reload();
        } else {
            alert('Please fill in all details before submitting the order.');
        }
    }
}
