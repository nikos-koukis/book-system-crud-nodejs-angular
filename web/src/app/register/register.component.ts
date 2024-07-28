import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { ValidationService } from '../services/validation.service'; // Import the validation service

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

  constructor(private authService: AuthService, private validationService: ValidationService) {}

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
        // Handle successful registration (e.g., navigate to login)
      },
      error => {
        console.error('Registration failed', error);
        // Handle errors (e.g., show feedback to the user)
      }
    );
  }
}
