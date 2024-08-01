import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

interface CartItem {
  bookId: string;
  title: string;
  price: number; // The price of the book
  quantity: number; // The quantity in the cart
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = []; // Cart items array
  private itemsSubject = new BehaviorSubject<CartItem[]>(this.cartItems); // Observable for cart items

  constructor(private cookieService: CookieService) {
    this.loadFromCookies(); // Load items from cookies when service is initiated
  }

  items$ = this.itemsSubject.asObservable(); // Expose the observable for subscribers

  // Method to add items to the cart
  addToCart(book: any): void {
    const item: CartItem = {
      bookId: book.isbn,
      title: book.title,
      price: 10, // Replace this with actual price logic if needed
      quantity: 1 // Start with a quantity of 1
    };

    const existingItemIndex = this.cartItems.findIndex(item => item.bookId === book.isbn);

    if (existingItemIndex > -1) {
      // If item already exists, check the quantity
      if (this.cartItems[existingItemIndex].quantity < book.stock) {
        // Increment the quantity if there is stock available
        this.cartItems[existingItemIndex].quantity += 1; 
      } else {
        alert(`Sorry, you cannot add more than ${book.stock} of this book.`);
      }
    } else {
      // If item does not exist and stock is available, add it to the cart
      if (book.stock > 0) {
        this.cartItems.push(item); 
      } else {
        alert(`Sorry, ${book.title} is out of stock!`);
      }
    }

    this.itemsSubject.next(this.cartItems); // Notify subscribers
    this.saveToCookies(); // Save to cookies after every change
  }

  // Load cart items from cookies
  loadFromCookies(): void {
    const cookieData = this.cookieService.get('cart');
    if (cookieData) {
      this.cartItems = JSON.parse(cookieData); // Load from cookie
      this.itemsSubject.next(this.cartItems); // Notify subscribers to update cart state
    }
  }

  removeFromCart(bookId: string): void {
    this.cartItems = this.cartItems.filter(item => item.bookId !== bookId);
    this.itemsSubject.next(this.cartItems); // Notify subscribers
    this.saveToCookies(); // Save changes in cookies
  }

  clearCart(): void {
    this.cartItems = [];
    this.itemsSubject.next(this.cartItems);
    this.cookieService.delete('cart'); // Clear cookie data
  }

  getTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  saveToCookies(): void {
    // Convert cart items to a JSON string and save to cookies
    this.cookieService.set('cart', JSON.stringify(this.cartItems), { expires: 7 }); // Store it in cookies for 7 days
  }

  getItemCount(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0); // Calculate total quantity of items
  }

  getCartItem(bookId: string): CartItem | undefined {
    return this.cartItems.find(item => item.bookId === bookId);
  }
}
