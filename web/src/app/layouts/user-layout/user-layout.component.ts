import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service'; // Import the CartService
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.css']
})
export class UserLayoutComponent implements OnInit {
  cartItemCount: number = 0; // Variable to hold the cart item count

  constructor(private cartService: CartService, private router: Router) { }

  ngOnInit(): void {
    // Subscribe to cart items to get the current count of items
    this.cartService.items$.subscribe(items => {
      this.cartItemCount = this.cartService.getItemCount(); // Get count from cart service
    });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // Check if a token exists
  }

  logout(): void {
    this.cartService.clearCart(); // Optional: clear cart on logout
    localStorage.removeItem('token'); // Remove token
    this.router.navigate(['/login']); // Redirect to login if not authenticated
  }
}
