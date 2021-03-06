import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Package } from '../models/package';

@Injectable({
  providedIn: 'root'
})
export class PackageService {

  apiUrl = `${environment.apiUrl}package`;

  constructor(private httpClient: HttpClient) { }

  public getAll() {
    const url = `${this.apiUrl}/get-all`;
    return this.httpClient.get(url);
  }

  public save(model: Package) {
    const url = `${this.apiUrl}/save`;
    return this.httpClient.post(url, model);
  }
}
