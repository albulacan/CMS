import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  showLogin = false;

  constructor(private router: Router,
    public userService: UserService) { }

  ngOnInit(): void {
  }

  reserveNow() {
    if (this.userService.userDetails.isAuthenticated && !this.userService.userDetails.admin) {
      this.router.navigate(['/client-reservation']);
    } else {
      this.showLogin = true;
    }
  }

  logout() {
    Swal.fire({
      title: 'Logout',
      text: "Are you sure you want to Logout?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        this.router.navigate(['/home']);
      }
    });
  }

  // getters

  get isAdminPage() {
    return this.router.url.includes('admin-');
  }

  get isClientReservationPage() {
    return this.router.url.includes('client-reservation');
  }

  get isInvoicePage() {
    return this.router.url.includes('admin-reservation/invoice');
  }

}