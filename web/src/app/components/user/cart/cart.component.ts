import { Component, OnInit } from '@angular/core';

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

  ngOnInit(): void {
    this.loadCart();
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
    // Clear all items from the cart
    this.cartItems = []; // Clear the array in the component
    localStorage.removeItem('cart'); // Clear cart in local storage
  }

  completeOrder(): void {
    if (this.cartItems.length > 0) {
      // Here you can handle the completion of the order, such as sending the cart to your backend service.
      alert('Order completed! Thank you for your purchase.');
      // Clear the cart after completing the order
      localStorage.removeItem('cart');
      this.cartItems = []; // Clear current cart in the component too
    } else {
      alert('Your cart is empty.');
    }
  }
}
