import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { OTP, UserModel } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiUrl = `${environment.apiUrl}user`;

  constructor(private httpClient: HttpClient) { }

  get userDetails() {
    if (!sessionStorage.getItem('user')) {
      return new UserModel();
    }
    return JSON.parse(sessionStorage.getItem('user')) as UserModel;
  }

  get hasSession() {
    return sessionStorage.getItem('user');
  }

  public adminLogin(model: UserModel) {
    const url = `${this.apiUrl}/admin-login`;
    return this.httpClient.post(url, model);
  }

  public signUp(model: UserModel) {
    const url = `${this.apiUrl}/sign-up`;
    return this.httpClient.post(url, model);
  }

  public clientLogin(model: UserModel) {
    const url = `${this.apiUrl}/client-login`;
    return this.httpClient.post(url, model);
  }

  public requestOtp(model: OTP) {
    const url = `${this.apiUrl}/request-otp`;
    return this.httpClient.post(url, model);
  }

  public validateOtp(model: OTP) {
    const url = `${this.apiUrl}/validate-otp`;
    return this.httpClient.post(url, model);
  }

  public updatePassword(model: UserModel) {
    const url = `${this.apiUrl}/update-password`;
    return this.httpClient.post(url, model);
  }
}
