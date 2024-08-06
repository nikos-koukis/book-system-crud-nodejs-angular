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
        error => {}
      );
    } else {
      this.router.navigate(['/login']); // Redirect to login if not authenticated
    }
  }
}
