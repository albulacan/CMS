import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { IHttpResponse } from 'src/app/shared/models/http-response';
import { Reservation } from 'src/app/shared/models/reservation';
import { ReservationService } from 'src/app/shared/services/reservation.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {

  private sub: any;
  isProcessing = false;
  model = new Reservation();
  currentDate = new Date();

  constructor(private route: ActivatedRoute,
    private reservationService: ReservationService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      const referenceNo = params['referenceNo'];
      this.getReservation(referenceNo);
    });
  }

  getReservation(refNo: string) {
    this.isProcessing = true;
    let httpResponse: IHttpResponse;
    this.reservationService.getByReferenceNo(refNo)
      .pipe(finalize(() => {
        if (httpResponse?.success) {
          this.model = httpResponse.body;
        } else {
          this.toastr.error(`Unable to get reservation. ${httpResponse.message}`);
        }
        this.isProcessing = false;
      }))
      .subscribe((response: IHttpResponse) => httpResponse = response,
        error => {
          console.log(error);
          this.isProcessing = false;
        });
  }

  print() {
    window.print();
  }

}
