import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BookExistsGuard implements CanActivate {
  constructor(private apiService: ApiService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const bookId = route.paramMap.get('id');
    const token = localStorage.getItem('token'); // Assuming the token is required for authentication

    // Call the ApiService to check if the book exists
    return this.apiService.getBookById(bookId!, token!).pipe(
      map(book => {
        if (book) {
          return true; // If book exists, allow access
        } else {
          this.router.navigate(['/admin/books']); // Redirect if book does not exist
          return false; // Deny access
        }
      }),
      catchError(() => {
        this.router.navigate(['/admin/books']);
        return of(false); // Return an observable of false
      }),
    );
  }
}
