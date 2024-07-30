import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:80/api'; // Adjust based on your API base URL

  constructor(private http: HttpClient) {}

  // Method to get all customers
  getCustomers(token: string): Observable<any[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/customers`, { headers });
  }

  // Method to get a customer by ID
  getCustomerById(id: string, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/customers/${id}`, { headers });
  }

  // Method to create a new customer
  addCustomer(customer: any, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/customers`, customer, { headers });
  }

  // Method to update a customer
  updateCustomer(id: string, customer: any, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/customers/${id}`, customer, { headers });
  }

  // Method to delete a customer
  deleteCustomer(id: string, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}/customers/${id}`, { headers });
  }
}
