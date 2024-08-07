import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { ToastService } from '../../../../utils/toast.service';
import { environment } from 'src/environments/environment';
interface Book {
    id: {
        _id: string;
        title: string;
        isbn: string;
        price: number;
        image: string;
    };
    quantity: number;
    _id: string;
}

interface User {
    id: {
        _id: string;
        username: string;
        email: string;
        phone?: string;
    };
}

interface Order {
    _id: string;
    user: User;
    status: string;
    createdAt: string;
    updatedAt: string;
    books: Book[];
}

@Component({
    selector: 'app-order-edit',
    templateUrl: './order-edit.component.html',
    styleUrls: ['./order-edit.component.css']
})
export class OrderEditComponent implements OnInit {
    order: Order = {
        _id: '',
        user: {
            id: {
                _id: '',
                username: '',
                email: ''
            }
        },
        status: '',
        createdAt: '',
        updatedAt: '',
        books: []
    };
    serverError: string | null = null;
    loading: boolean = true;
    selectedStatus: string = ''; // Property to hold the user-selected status

    private apiUrl = environment.apiUrl;

    constructor(private apiService: ApiService, private router: Router, private route: ActivatedRoute, private toastService: ToastService) {}

    ngOnInit(): void {
        const orderId = this.route.snapshot.paramMap.get('id');
        
        if (!orderId) {
            // Redirect to the orders list if no orderId is found
            this.router.navigate(['/admin/orders']);
        } else {
            this.getOrder(orderId);
        }
    }

    getOrder(orderId: string): void {
        this.loading = true;
        const token = localStorage.getItem('token');

        if (token) {
            this.apiService.getOrder(orderId, token).subscribe(
                (response: { order: Order }) => {
                    this.order = response.order;
                    this.selectedStatus = this.order.status; // Set the selected status based on the fetched order

                    // Construct image URLs for books
                    if (this.order.books) {
                        this.order.books = this.order.books.map(book => ({
                            ...book,
                            id: { ...book.id, image: `${this.apiUrl}/${book.id.image}` }
                        }));
                    }
                    this.loading = false;
                },
                error => {
                    // Check for a 404 response indicating the order does not exist
                    if (error.status === 404) {
                        this.router.navigate(['/admin/orders']); // Redirect to orders if order is not found
                    } else {
                        this.router.navigate(['/admin/orders']);
                        this.serverError = error.error.message || 'An unexpected error occurred.';
                    }
                    this.loading = false;
                }
            );
        } else {
            this.serverError = 'User is not authenticated.';
            this.loading = false;
        }
    }

    getFinalPrice(): number {
        return this.order.books.reduce((total, book) => {
            return total + (book.id.price * book.quantity);
        }, 0);
    }

    onSubmit(): void {
        const token = localStorage.getItem('token');
        if (token) {
            this.apiService.updateOrder(this.order._id, { status: this.selectedStatus }, token).subscribe(
                () => {
                    setTimeout(() => {
                        this.toastService.showToast('Status updated successfully!', 'success'); // Show success toast
                      }, 150);
                    this.router.navigate(['/admin/orders']);
                },
                error => {
                    setTimeout(() => {
                        this.toastService.showToast('Status not updated successfully!', 'error'); // Show success toast
                      }, 150);
                }
            );
        }
    }

    cancel(): void {
        this.router.navigate(['/admin/orders']);
    }
}
