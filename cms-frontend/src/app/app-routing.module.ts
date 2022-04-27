import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { AdminReservationsComponent } from './admin/admin-reservations/admin-reservations.component';
import { InvoiceComponent } from './admin/admin-reservations/invoice/invoice.component';
import { MenuManagementComponent } from './admin/menu-management/menu-management.component';
import { PackageManagementComponent } from './admin/package-management/package-management.component';
import { SalesReportComponent } from './admin/sales-report/sales-report.component';
import { HomeComponent } from './home/home.component';
import { ReservationComponent } from './reservation/reservation.component';
import { AuthGuard } from './shared/directives/guard/auth.guard';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'admin-login',
    component: AdminLoginComponent
  },
  {
    path: 'admin-reservation',
    component: AdminReservationsComponent,
    data: {
      isAdmin: true
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'admin-package-management',
    component: PackageManagementComponent,
    data: {
      isAdmin: true
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'admin-menu-management',
    component: MenuManagementComponent,
    data: {
      isAdmin: true
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'admin-sales-report',
    component: SalesReportComponent,
    data: {
      isAdmin: true
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'client-reservation',
    component: ReservationComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin-reservation/invoice/:referenceNo',
    component: InvoiceComponent,
    data: {
      isAdmin: true
    },
    canActivate: [AuthGuard]
  },
  {
      path: '**',
      component: HomeComponent
  },
  {
      path: '',
      redirectTo: '/home',
      pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
