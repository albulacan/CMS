import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Reservation } from '../models/reservation';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  apiUrl = `${environment.apiUrl}reservation`;

  constructor(private httpClient: HttpClient) { }

  public getByDate(model: Reservation) {
    const url = `${this.apiUrl}/get-by-date`;
    return this.httpClient.post(url, model);
  }

  public getByUserId(userId: number) {
    const url = `${this.apiUrl}/get-by-user/${userId}`;
    return this.httpClient.get(url);
  }

  public getByYear(year: string) {
    const url = `${this.apiUrl}/get-by-year/${year}`;
    return this.httpClient.get(url);
  }

  public getByReferenceNo(referenceNo: string) {
    const url = `${this.apiUrl}/get-by-reference-no`;
    return this.httpClient.post(url, { referenceNo } );
  }

  public save(model: Reservation) {
    const url = `${this.apiUrl}/save`;
    return this.httpClient.post(url, model);
  }

  public update(model: Reservation) {
    const url = `${this.apiUrl}/update`;
    return this.httpClient.post(url, model);
  }
}
