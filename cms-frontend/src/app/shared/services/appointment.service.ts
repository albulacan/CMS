import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Appointment } from '../models/appointment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  apiUrl = `${environment.apiUrl}appointment`;

  constructor(private httpClient: HttpClient) { }

  public getByUserId(userId: number) {
    const url = `${this.apiUrl}/get-by-user/${userId}`;
    return this.httpClient.get(url);
  }

  public save(model: Appointment) {
    const url = `${this.apiUrl}/save`;
    return this.httpClient.post(url, model);
  }
}
