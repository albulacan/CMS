import { Component, OnInit } from '@angular/core';
import { DataGridServerService } from 'src/app/shared/directives/attribute/data-grid-server.service';
import { DataGridFactory } from 'src/app/shared/directives/attribute/data-grid.factory';
import { Appointment } from 'src/app/shared/models/appointment';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin-appointment',
  templateUrl: './admin-appointment.component.html',
  styleUrls: ['./admin-appointment.component.css']
})
export class AdminAppointmentComponent implements OnInit {

  grid: DataGridServerService<Appointment>;

  constructor(private dgFactory: DataGridFactory) { }

  ngOnInit(): void {
    const url = `${environment.apiUrl}appointment/get-data-grid`;
    this.grid = this.dgFactory.post({ url }, new Appointment());
  }

}
