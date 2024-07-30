import { Component } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-add',
  templateUrl: './customer-add.component.html',
  styleUrls: ['./customer-add.component.css']
})
export class CustomerAddComponent {
  name: string = '';
  email: string = '';
  phone: string = '';
  serverError: string = '';
  
  constructor(private apiService: ApiService, private router: Router) {}

  addCustomer(): void {
    const customer = {
      name: this.name,
      email: this.email,
      phone: this.phone
    };

    const token = localStorage.getItem('token'); // Get token

    if (token) {
      this.apiService.addCustomer(customer, token).subscribe(
        response => {
          console.log('Customer added successfully', response);
          this.router.navigate(['admin/customers']); // Redirect to customer list after adding
        },
        error => {
          console.error('Failed to add customer', error);
          this.serverError = error.error.message || 'An unexpected error occurred.';
        }
      );
    } else {
      this.serverError = 'User is not authenticated.';
      this.router.navigate(['/login']); // Redirect to login if not authenticated
    }
  }
}
