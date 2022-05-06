import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { IHttpResponse } from '../shared/models/http-response';
import { Payment, Reservation } from '../shared/models/reservation';
import { ReservationService } from '../shared/services/reservation.service';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-track-reservation',
  templateUrl: './track-reservation.component.html',
  styleUrls: ['./track-reservation.component.css']
})
export class TrackReservationComponent implements OnInit {

  isProcessing = false;
  reservations = [] as Reservation[];
  model: Reservation = new Reservation();

  constructor(private toastr: ToastrService,
    private userService: UserService,
    private reservationService: ReservationService) { }

  ngOnInit(): void {
    this.getReservations();
  }

  getReservations() {
    this.isProcessing = true;
    let httpResponse: IHttpResponse;
    this.reservationService.getByUserId(this.userService.userDetails.userId)
      .pipe(finalize(() => {
        if (httpResponse?.success) {
          this.reservations = httpResponse.body;
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

  view(item: Reservation) {
    this.model = JSON.parse(JSON.stringify(item));
  }

  download(item: Payment) {
    const a = document.createElement('a');
    a.download = item.fileName;
    a.href = item.attachment;
    a.click();
  }

  get totalItems() {
    let total = (this.model?.packages?.length || 0);
    if (this.model?.menus?.length) {
      this.model.menus.forEach(x => {
        total = +total + +x.quantity;
      });
    }
    return total;
  }

}
