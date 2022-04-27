import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SharedModule } from './shared/shared.module';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { AdminReservationsComponent } from './admin/admin-reservations/admin-reservations.component';
import { PackageManagementComponent } from './admin/package-management/package-management.component';
import { MenuManagementComponent } from './admin/menu-management/menu-management.component';
import { HttpClientModule } from '@angular/common/http';
import { ReservationComponent } from './reservation/reservation.component';
import { FooterComponent } from './footer/footer.component';
import { InvoiceComponent } from './admin/admin-reservations/invoice/invoice.component';
import { SalesReportComponent } from './admin/sales-report/sales-report.component';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    HomeComponent,
    LoginComponent,
    AdminLoginComponent,
    AdminReservationsComponent,
    PackageManagementComponent,
    MenuManagementComponent,
    ReservationComponent,
    FooterComponent,
    InvoiceComponent,
    SalesReportComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    SharedModule,
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot({
      closeButton: true
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
