import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { UserDashboardComponent } from './components/user/user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { CustomerListComponent } from './components/admin/customers/customer-list/customer-list.component';
import { CustomerAddComponent } from './components/admin/customers/customer-add/customer-add.component';
import { BookListComponent } from './components/admin/books/book-list/book-list.component';
import { BookEditComponent } from './components/admin/books/book-edit/book-edit.component';
import { BookCreateComponent } from './components/admin/books/book-create/book-create.component';

import { AuthGuard } from './components/auth/guards/auth.guard'; 
import {BookExistsGuard} from './components/admin/guards/book-exists.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent }, // No guard needed for login
  { path: 'dashboard', component: UserDashboardComponent, canActivate: [AuthGuard] }, // User Dashboard protected
  { path: 'admin', canActivate: [AuthGuard], children: [ // Admin dashboard and child routes protected
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'customers', component: CustomerListComponent }, // Add more admin child routes here
      { path: 'customers/new', component: CustomerAddComponent }, // Add more admin child routes here
      { path: 'books', component: BookListComponent}, // Book List
      { path: 'books/edit/:id', component: BookEditComponent, canActivate: [BookExistsGuard] },
      { path: 'books/add', component: BookCreateComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
