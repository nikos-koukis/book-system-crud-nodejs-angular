import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ValidationService } from '../../../utils/validation.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  phone: string = '';
  password: string = '';
  confirmPassword: string = '';
  role: string = 'user';
  validationErrors: string[] = [];
  serverError: string | null = null;

  constructor(private authService: AuthService, private validationService: ValidationService, private router: Router) {}

  register(): void {
    const user = {
      username: this.username,
      email: this.email,
      phone: this.phone,
      password: this.password,
      confirmPassword: this.confirmPassword, // Include confirm password in the user object
      role: this.role
    };

    // Validate the form
    this.validationErrors = this.validationService.validateRegistrationForm(user);

    // If there are validation errors, do not proceed
    if (this.validationErrors.length > 0) {
      return; // Stop the registration process
    }

    //Proceed with registration if there are no validation errors
    this.authService.register(user).subscribe(
      response => {
        this.router.navigate(['/login']);
        this.clearFormFields();
      },
      error => {
        this.serverError = error.error.message || 'An unexpected error occurred.';
      }
    );
  }

  private clearFormFields() {
    this.username = '';
    this.email = '';
    this.phone = '';
    this.password = '';
    this.confirmPassword = '';
    this.role = 'user'; // Reset to the default role
    this.validationErrors = []; // Clear any existing validation errors
    this.serverError = ''; // Clear any server errors
  }
}
