import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../utils/toast.service';
interface Book {
    _id?: string;
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
    userDetails: { email: string; } = { email: '' };

    constructor(private authService: AuthService, private apiService: ApiService, private router: Router, private toastService: ToastService) { }

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
        const bookTitle = this.cartItems[index].title;
        this.cartItems.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(this.cartItems));

        setTimeout(() => {
            this.toastService.showToast(`Book "${bookTitle}" removed from cart`, 'success');
        }, 150);
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
                }
            );
        }
    }

    submitOrder(): void {
        if (this.cartItems.length === 0 || !this.userDetails.email) {
            alert('Please fill in all details before submitting the order.');
            return;
        }
        const token = localStorage.getItem('token');
        if (token) {
            this.authService.getDashboard(token).subscribe(
                response => {
                    const userId = response.user._id;
                    const order = {
                        userId: userId,
                        books: this.cartItems.map(item => ({
                            bookId: item._id, // Use bookId that corresponds to the API request
                            quantity: item.quantity // Pass the quantity
                        }))
                    };
                    if (order.books.length === 0) {
                        alert('Please add books to the cart before submitting the order.');
                        return;
                    }
                    this.apiService.submitOrder(order, token).subscribe(
                        response => {
                            localStorage.removeItem('cart');
                            this.cartItems = [];

                            setTimeout(() => {
                                this.toastService.showToast('Order submitted successfully', 'success');
                            }, 150);
                            this.router.navigate(['/dashboard']);
                        },
                        error => {
                        }
                    );
                },
                error => {
                    return;
                }
            );
        }
    }
}
