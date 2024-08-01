import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../services/cart.service'; // Import the CartService

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: any[] = []; // To hold the cart items
  total: number = 0; // Total price

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.items$.subscribe(items => {
      this.cartItems = items;
      this.total = this.cartService.getTotal(); // Calculate total when cart items change
    });
  }

  removeItem(bookId: string): void {
    this.cartService.removeFromCart(bookId);
  }

  clearCart(): void {
    this.cartService.clearCart(); // Clear all items in the cart
  }
  
}
