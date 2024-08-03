import { Component } from '@angular/core';
import { AuthService } from './components/auth/services/auth.service';
import { ToastService } from './utils/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'tokenauth';
  constructor(private authService: AuthService, private toastService: ToastService) {}

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // Check if a token exists
  }

  logout(): void {
    this.authService.logout();
    localStorage.removeItem('token');
  }

  showSuccessToast() {
    this.toastService.showToast('This is a success message!', 'success');
  }

  showErrorToast() {
    this.toastService.showToast('This is an error message!', 'error');
  }
}
