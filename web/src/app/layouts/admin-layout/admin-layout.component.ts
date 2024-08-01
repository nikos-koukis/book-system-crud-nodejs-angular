import { Component } from '@angular/core';
import { AuthService } from '../../components/auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent {
  constructor(private authService: AuthService, private router: Router) {}

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // Check if a token exists
  }

  logout(): void {
    this.authService.logout(); // Call the logout method in your AuthService
    localStorage.removeItem('token');
    this.router.navigate(['/login']); // Redirect to login after logout
  }
}
