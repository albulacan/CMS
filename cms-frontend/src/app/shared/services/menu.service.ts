import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Menu } from '../models/menu';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  apiUrl = `${environment.apiUrl}menu`;

  constructor(private httpClient: HttpClient) { }

  public getAll() {
    const url = `${this.apiUrl}/get-all`;
    return this.httpClient.get(url);
  }

  public getByCategory(category: string) {
    const url = `${this.apiUrl}/get-by-category/${category}`;
    return this.httpClient.get(url);
  }

  public getById(id: number) {
    const url = `${this.apiUrl}/get-by-id/${id}`;
    return this.httpClient.get(url);
  }

  public save(model: Menu) {
    const url = `${this.apiUrl}/save`;
    return this.httpClient.post(url, model);
  }
}
