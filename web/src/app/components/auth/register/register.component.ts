import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ValidationService } from '../../../utils/validation.service'; // Import the validation service
import { Router } from '@angular/router'; // Import Router for navigation

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = ''; // New field for confirm password
  role: string = 'user';
  validationErrors: string[] = []; // To hold validation errors
  serverError: string = ''; // Variable to hold server-side errors

  constructor(private authService: AuthService, private validationService: ValidationService, private router: Router) {} // Inject Router

  register(): void {
    const user = {
      username: this.username,
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword, // Include confirm password in the user object
      role: this.role
    };

    // Validate the form
    this.validationErrors = this.validationService.validateRegistrationForm(user);

    // If there are validation errors, do not proceed
    if (this.validationErrors.length > 0) {
      console.error('Registration failed due to validation errors', this.validationErrors);
      return; // Stop the registration process
    }

    //Proceed with registration if there are no validation errors
    this.authService.register(user).subscribe(
      response => {
        console.log('Registration successful', response);
        // Clear the form fields
        this.clearFormFields();
        // Redirect to the login page
        this.router.navigate(['/login']);
      },
      error => {
        console.error('Registration failed', error);
        this.serverError = error.error.message || 'An unexpected error occurred.';
      }
    );
  }

  private clearFormFields() {
    this.username = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
    this.role = 'user'; // Reset to the default role
    this.validationErrors = []; // Clear any existing validation errors
    this.serverError = ''; // Clear any server errors
  }
}
