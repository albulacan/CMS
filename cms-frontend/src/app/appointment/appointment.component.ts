import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { BsModalService } from '../shared/directives/attribute/bs-modal.service';
import { Appointment } from '../shared/models/appointment';
import { IHttpResponse } from '../shared/models/http-response';
import { AppointmentService } from '../shared/services/appointment.service';
import { UserService } from '../shared/services/user.service';
import { UtilityService } from '../shared/services/utility.service';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit {

  isProcessing = false;
  appointments = [] as Appointment[];
  model = new Appointment();
  timeFrom = '';
  timeTo = '';
  modal: BsModalService;

  constructor(private toastr: ToastrService,
    private userService: UserService,
    private utilService: UtilityService,
    private appointmentService: AppointmentService) { }

  ngOnInit(): void {
    this.getAppointments();
  }

  getAppointments() {
    this.isProcessing = true;
    let httpResponse: IHttpResponse;
    this.appointmentService.getByUserId(this.userService.userDetails.userId)
      .pipe(finalize(() => {
        if (httpResponse?.success) {
          this.appointments = httpResponse.body;
        } else {
          this.toastr.error(`Unable to get appointments. ${httpResponse.message}`);
        }
        this.isProcessing = false;
      }))
      .subscribe((response: IHttpResponse) => httpResponse = response,
        error => {
          console.log(error);
          this.isProcessing = false;
        });
  }

  add() {
    this.model = new Appointment();
    this.modal.open();
  }

  submit() {
    if (!this.model.referenceNo) {
      this.toastr.error('Reference No is required.');
      return;
    }
    if (!this.model.date) {
      this.toastr.error('Date is required.');
      return;
    }
    if (!this.timeFrom) {
      this.toastr.error('Time From is required.');
      return;
    }
    if (!this.timeTo) {
      this.toastr.error('Time To is required.');
      return;
    }
    Swal.fire({
      title: 'Set Appointment',
      text: "You are about to add appointment. Click Yes to proceed.",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this.model.time = `${this.timeFrom}-${this.timeTo}`;
        this.model.userId = this.userService.userDetails.userId;
        this.model.date = this.utilService.toJsonDate(this.model.date);
        this.save();
      }
    });
  }

  save() {
    this.isProcessing = true;
    let httpResponse: IHttpResponse;
    this.appointmentService.save(this.model)
      .pipe(finalize(() => {
        if (httpResponse?.success) {
          this.getAppointments();
          this.model = new Appointment();
          this.timeFrom = '';
          this.timeTo = '';
          this.modal.close();
          Swal.fire(
            'Success!',
            'Your appointment with us is successfully added.',
            'success'
          );
        } else {
          this.toastr.error(`Unable to save appointment. ${httpResponse.message}`);
        }
        this.isProcessing = false;
      }))
      .subscribe((response: IHttpResponse) => httpResponse = response,
        error => {
          console.log(error);
          this.isProcessing = false;
        });
  }

}
