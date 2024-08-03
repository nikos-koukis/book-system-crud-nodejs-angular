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

  getBooks(token: string): Observable<any[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/books`, { headers });
  }

  getBookById(id: string, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/books/${id}`, { headers });
  }

  updateBook(id: string, book: any, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/books/${id}`, book, { headers });
  }

  deleteBook(id: string, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}/books/${id}`, { headers });
  }

  createBook(formData: FormData, token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/books`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  submitOrder(order: any, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/order`, order, { headers });
  }

  getOrders(token: string): Observable<any> { // Specify return type
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/order`, { headers });
  }

  getOrder(orderId: string, token: string): Observable<any> { // Specify return type
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/order/${orderId}`, { headers });
  }

  deleteOrder(orderId: string, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}/order/${orderId}`, { headers });
  }

  updateOrder(orderId: string, order: any, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/order/${orderId}/status`, order, { headers });
  }

}
