import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { UserDashboardComponent } from './components/user/user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { CustomerListComponent } from './components/admin/customers/customer-list/customer-list.component';
import { CustomerAddComponent } from './components/admin/customers/customer-add/customer-add.component';
import { BookListComponent } from './components/admin/books/book-list/book-list.component';
import { BookEditComponent } from './components/admin/books/book-edit/book-edit.component';
import { BookCreateComponent } from './components/admin/books/book-create/book-create.component';

import {UserLayoutComponent} from './layouts/user-layout/user-layout.component';
import {AdminLayoutComponent} from './layouts/admin-layout/admin-layout.component';

import { CartComponent } from './components/user/cart/cart.component';

import { AuthGuard } from './components/auth/guards/auth.guard';
import { NoAuthGuard } from './components/auth/guards/no-auth.guard';
import {BookExistsGuard} from './components/admin/guards/book-exists.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] }, // No guard needed for login
  { path: 'register', component: RegisterComponent, canActivate: [NoAuthGuard] }, // No guard needed for login
  //{ path: 'dashboard', component: UserDashboardComponent, canActivate: [AuthGuard] }, // User Dashboard protected

  { 
    path: 'dashboard', 
    component: UserLayoutComponent, 
    canActivate: [AuthGuard], 
    children: [
      // User dashboard child routes
      { path: '', component: UserDashboardComponent }, // Default user dashboard
      { path: 'cart', component: CartComponent },
    ]
  },

  { 
    path: 'admin', 
    component: AdminLayoutComponent, 
    canActivate: [AuthGuard], 
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'customers', component: CustomerListComponent },
      { path: 'customers/new', component: CustomerAddComponent },
      { path: 'books', component: BookListComponent },
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
