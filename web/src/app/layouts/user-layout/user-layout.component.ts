import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.css']
})
export class UserLayoutComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Subscribe to cart items to get the current count of items
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // Check if a token exists
  }

  logout(): void {
    localStorage.removeItem('token'); // Remove token
    localStorage.removeItem('cart'); // Clear cart on logout if necessary
    this.router.navigate(['/login']); // Redirect to login if not authenticated
  }

  getCartCount(): number {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    return cart.length; // Return the number of items in the cart
  }
}
