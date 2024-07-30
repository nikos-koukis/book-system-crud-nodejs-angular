import { Component } from '@angular/core';
import { AuthService } from './components/auth/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'tokenauth';
  constructor(private authService: AuthService) {}

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // Check if a token exists
  }

  logout(): void {
    this.authService.logout();
    localStorage.removeItem('token');
  }
}
