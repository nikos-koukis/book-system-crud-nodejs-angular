import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {
  customers: any[] = []; // Array to hold customer data
  serverError: string = ''; // Variable to hold error messages
  editingCustomerId: string | null = null; // Variable to keep track of which customer is being edited
  updatedCustomer: any = {}; // Object to hold updated customer info

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.getCustomers();
  }

  getCustomers(): void {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    if (token) {
      this.apiService.getCustomers(token).subscribe(
        response => {
          this.customers = response; // Assuming the response returns an array of customers
        },
        error => {
          console.error('Failed to fetch customers', error);
          this.serverError = error.error.message || 'An unexpected error occurred.';
        }
      );
    } else {
      this.serverError = 'User is not authenticated.';
      this.router.navigate(['/login']); // Redirect to login if not authenticated
    }
  }

  // Open the edit form for a customer
  openEditCustomerModal(customer: any): void {
    this.editingCustomerId = customer._id; // Set the customer ID for editing
    this.updatedCustomer = { ...customer }; // Copy current customer data to make edits
  }

  // Method to save the updated customer details
  saveCustomer(): void {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    if (token) {
      this.apiService.updateCustomer(this.updatedCustomer._id, this.updatedCustomer, token).subscribe(
        response => {
          console.log('Customer updated successfully', response);
          this.getCustomers(); // Refresh the list after editing
          this.editingCustomerId = null; // Clear the editing ID after saving
        },
        error => {
          console.error('Failed to update customer', error);
          this.serverError = error.error.message || 'An unexpected error occurred.';
        }
      );
    } else {
      this.serverError = 'User is not authenticated.';
      this.router.navigate(['/login']); // Redirect to login if not authenticated
    }
  }

  // Method to cancel editing
  cancelEditing(): void {
    this.editingCustomerId = null; // Clear editing state
    this.updatedCustomer = {}; // Clear updated customer object
  }

  // Method to delete a customer
  deleteCustomer(customerId: string): void {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    if (token) {
      this.apiService.deleteCustomer(customerId, token).subscribe(
        response => {
          console.log('Customer deleted successfully', response);
          this.getCustomers(); // Refresh the customer list
        },
        error => {
          console.error('Failed to delete customer', error);
          this.serverError = error.error.message || 'An unexpected error occurred.';
        }
      );
    } else {
      this.serverError = 'User is not authenticated.';
      this.router.navigate(['/login']); // Redirect to login if not authenticated
    }
  }
}
