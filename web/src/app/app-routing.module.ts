import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { UserDashboardComponent } from './components/user/user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { CustomerListComponent } from './components/admin/customers/customer-list/customer-list.component';
import { BookListComponent } from './components/admin/books/book-list/book-list.component';
import { BookEditComponent } from './components/admin/books/book-edit/book-edit.component';
import { BookCreateComponent } from './components/admin/books/book-create/book-create.component';
import { CartComponent } from './components/user/cart/cart.component';
import { OrderListComponent } from './components/admin/orders/order-list/order-list.component';
import { OrderEditComponent } from './components/admin/orders/order-edit/order-edit.component';

import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';


import { AuthGuard } from './components/auth/guards/auth.guard';
import { NoAuthGuard } from './components/auth/guards/no-auth.guard';
import { BookExistsGuard } from './components/admin/guards/book-exists.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] }, // No guard needed for login
  { path: 'register', component: RegisterComponent, canActivate: [NoAuthGuard] }, // No guard needed for login

  {
    path: 'dashboard',
    component: UserLayoutComponent,
    canActivate: [AuthGuard],
    children: [
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
      { path: 'books', component: BookListComponent },
      { path: 'books/:id', component: BookEditComponent, canActivate: [BookExistsGuard] },
      { path: 'book/add', component: BookCreateComponent },
      { path: 'orders', component: OrderListComponent },
      { path: 'order/:id', component: OrderEditComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
