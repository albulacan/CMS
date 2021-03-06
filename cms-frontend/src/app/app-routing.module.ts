import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminAppointmentComponent } from './admin/admin-appointment/admin-appointment.component';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { AdminReservationsComponent } from './admin/admin-reservations/admin-reservations.component';
import { InvoiceComponent } from './admin/admin-reservations/invoice/invoice.component';
import { MenuManagementComponent } from './admin/menu-management/menu-management.component';
import { PackageManagementComponent } from './admin/package-management/package-management.component';
import { SalesReportComponent } from './admin/sales-report/sales-report.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { HomeComponent } from './home/home.component';
import { ReservationComponent } from './reservation/reservation.component';
import { AuthGuard } from './shared/directives/guard/auth.guard';
import { TrackReservationComponent } from './track-reservation/track-reservation.component';


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
    path: 'admin-appointment',
    component: AdminAppointmentComponent,
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
    path: 'track-reservation',
    component: TrackReservationComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'set-appointment',
    component: AppointmentComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin-reservation/invoice/:referenceNo',
    component: InvoiceComponent,
    data: {
      isAdmin: true
    }
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
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
