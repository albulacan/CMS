import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { IHttpResponse } from 'src/app/shared/models/http-response';
import { UserService } from 'src/app/shared/services/user.service';
import { UserModel } from '../../shared/models/user';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {

  model: UserModel = new UserModel();
  isProcessing = false;

  constructor(private toastr: ToastrService,
    private router: Router,
    private userService: UserService) { }

  ngOnInit(): void {
  }

  login() {
    if (!this.model.username) {
      this.toastr.error("Please enter username.");
      return;
    }
    if (!this.model.password) {
      this.toastr.error("Please enter password.");
      return;
    }

    this.isProcessing = true;
    let httpResponse: IHttpResponse;
    this.userService.adminLogin(this.model)
      .pipe(finalize(() => {
        if (httpResponse?.success) {
          this.toastr.success(`Successfully signed in.`);
          this.model = httpResponse.body;
          this.model.isAuthenticated = true;
          sessionStorage.setItem('user', JSON.stringify(this.model));
          this.router.navigate(['/admin-reservation']);
        } else {
          this.toastr.error(`${httpResponse.message}`);
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
