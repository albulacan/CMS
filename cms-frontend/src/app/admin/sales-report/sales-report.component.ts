import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { IHttpResponse } from 'src/app/shared/models/http-response';
import { Reservation } from 'src/app/shared/models/reservation';
import { ReservationService } from 'src/app/shared/services/reservation.service';

@Component({
  selector: 'app-sales-report',
  templateUrl: './sales-report.component.html',
  styleUrls: ['./sales-report.component.css']
})
export class SalesReportComponent implements OnInit {

  year = '';
  month = '';
  sales = [] as Reservation[];
  isProcessing = false;

  constructor(private toastr: ToastrService,
    private reservationService: ReservationService) { }

  ngOnInit(): void {
  }

  getReport() {
    if (!this.year || !this.month) {
      return;
    }
    this.isProcessing = true;
      let httpResponse: IHttpResponse;
      this.reservationService.getByYearMonth(this.year, this.month)
        .pipe(finalize(() => {
          if (httpResponse?.success) {
            this.sales = httpResponse.body;
          } else {
            this.toastr.error(`Unable to get reservations. ${httpResponse.message}`);
          }
          this.isProcessing = false;
        }))
        .subscribe((response: IHttpResponse) => httpResponse = response,
          error => {
            console.log(error);
            this.isProcessing = false;
          });
  }

  get totalSales() {
    if (!this.sales?.length) {
      return 0;
    }
    let total = 0;
    this.sales.forEach(x => total = +total + +x.amountDue);
    return total;
  }

}
