import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './components/auth/register/register.component';
import { LoginComponent } from './components/auth/login/login.component';
import { UserDashboardComponent } from './components/user/user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { CustomerListComponent } from './components/admin/customers/customer-list/customer-list.component';
import { CustomerAddComponent } from './components/admin/customers/customer-add/customer-add.component';
import { BookListComponent } from './components/admin/books/book-list/book-list.component';
import { BookEditComponent } from './components/admin/books/book-edit/book-edit.component';
import { BookCreateComponent } from './components/admin/books/book-create/book-create.component';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { CartComponent } from './components/user/cart/cart.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UserDashboardComponent,
    AdminDashboardComponent,
    CustomerListComponent,
    CustomerAddComponent,
    BookListComponent,
    BookEditComponent,
    BookCreateComponent,
    UserLayoutComponent,
    AdminLayoutComponent,
    CartComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
