import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { BsModalService } from 'src/app/shared/directives/attribute/bs-modal.service';
import { DataGridServerService } from 'src/app/shared/directives/attribute/data-grid-server.service';
import { DataGridFactory } from 'src/app/shared/directives/attribute/data-grid.factory';
import { IHttpResponse } from 'src/app/shared/models/http-response';
import { Payment, Reservation } from 'src/app/shared/models/reservation';
import { ReservationService } from 'src/app/shared/services/reservation.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
  selector: 'app-admin-reservations',
  templateUrl: './admin-reservations.component.html',
  styleUrls: ['./admin-reservations.component.css']
})
export class AdminReservationsComponent implements OnInit {

  grid: DataGridServerService<Reservation>;
  filter = new Reservation();
  detailModal: BsModalService;
  model = new Reservation();
  isProcessing = false;
  amountPaid = 0;
  origAmountPaid = 0;
  origStatus = '';

  constructor(private dgFactory: DataGridFactory,
    private toastr: ToastrService,
    private reservationService: ReservationService,
    private location: Location) { }

  ngOnInit(): void {
    const url = `${environment.apiUrl}reservation/get-data-grid`;
    this.grid = this.dgFactory.post({ url }, this.filter);
  }

  view(item: Reservation) {
    this.model = JSON.parse(JSON.stringify(item));
    this.amountPaid = 0;
    this.origAmountPaid = item.amountPaid;
    this.origStatus = item.status;
    this.detailModal.open();
  }

  update() {
    if (!this.model.status) {
      this.toastr.error('Status is required.');
      return;
    }

    Swal.fire({
      title: 'Update Reservation',
      text: "Are you sure you want to update this reservation?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this.save();
      }
    });
  }

  calculateAmountPaid() {
    this.model.amountPaid = +this.origAmountPaid + (+this.amountPaid || 0);
  }

  save() {
    this.isProcessing = true;
    let httpResponse: IHttpResponse;
    this.reservationService.update(this.model)
      .pipe(finalize(() => {
        if (httpResponse?.success) {
          this.toastr.success('Reservation successfully updated.');
          this.model = new Reservation();
          this.amountPaid = 0;
          this.detailModal.close();
          this.grid.load();
        } else {
          this.toastr.error(`Unable to update reservation. ${httpResponse.message}`);
        }
        this.isProcessing = false;
      }))
      .subscribe((response: IHttpResponse) => httpResponse = response,
        error => {
          console.log(error);
          this.isProcessing = false;
        });
  }

  generateInvoice() {
    const baseUrl = this.location.prepareExternalUrl(this.location.path());
    window.open(`${baseUrl}/invoice/${this.model.referenceNo}`);
  }

  download(item: Payment) {
    const a = document.createElement('a');
    a.download = item.fileName;
    a.href = item.attachment;
    a.click();
  }

  get totalItem() {
    let total = this.model?.packages?.length || 0;
    this.model?.menus?.forEach(x => total = +total + +x.quantity);
    return total;
  }
}
