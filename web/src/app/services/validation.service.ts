import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

  // Check if a field is empty
  isFieldEmpty(field: string): boolean {
    return field.trim().length === 0;
  }

  // Validate if password and confirm password match
  doPasswordsMatch(password: string, confirmPassword: string): boolean {
    return password === confirmPassword;
  }

  isEmailValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex pattern
    return emailRegex.test(email);
  }

  isPasswordValid(password: string): boolean {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/; // Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, and 1 number
    return passwordRegex.test(password);
  }

  // Validate the entire user registration form
  validateRegistrationForm(user: { username: string; email: string; password: string; confirmPassword: string }): string[] {
    const errors: string[] = [];

    if (this.isFieldEmpty(user.username)) {
      errors.push('Username is required.');
    }
    
    if (this.isFieldEmpty(user.email)) {
      errors.push('Email is required.');
    }

    if (this.isFieldEmpty(user.password)) {
      errors.push('Password is required.');
    }
    
    if (this.isFieldEmpty(user.confirmPassword)) {
      errors.push('Confirm Password is required.');
    } else if (!this.doPasswordsMatch(user.password, user.confirmPassword)) {
      errors.push('Passwords do not match.');
    }

    if(this.isEmailValid(user.email) === false){
      errors.push('Email is invalid.');
    }

    if(this.isPasswordValid(user.password) === false){
      errors.push('Password is invalid.');
    } 

    return errors;
  }
}
