import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = ''; // Change username to email
  password: string = '';
  serverError: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    const credentials = {
      email: this.email, // Use email here
      password: this.password
    };

    this.authService.login(credentials).subscribe(
      response => {
        localStorage.setItem('token', response.token); // Store JWT
        this.router.navigate(['/dashboard']); // Navigate to the dashboard
      },
      error => {
        console.error('Login failed', error);
        this.serverError = error.error.message || 'Login failed. Please try again.';
      }
    );
  }
}
