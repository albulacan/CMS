import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { timer } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { BsModalService } from '../shared/directives/attribute/bs-modal.service';
import { IHttpResponse } from '../shared/models/http-response';
import { OTP, UserModel } from '../shared/models/user';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {

  @Output() ngModalClose = new EventEmitter<boolean>();

  modal: BsModalService;
  passwordResetModal: BsModalService;
  model: UserModel = new UserModel();

  isProcessing = false;
  isLogin = true;
  isSignUp = false;
  otpModel = new OTP();
  stage = 1;
  otpTitle = "Request OTP";
  otpTimer = 0;

  constructor(private toastr: ToastrService,
    private userService: UserService,
    private router: Router) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.modal.open();
  }

  close() {
    this.modal.close();
    this.ngModalClose.emit(true);
  }

  login() {
    this.model = new UserModel();
    this.isLogin = true;
    this.isSignUp = false;
  }

  signup() {
    this.model = new UserModel();
    this.isLogin = false;
    this.isSignUp = true;
  }

  submit() {
    if (this.isLogin) {
      if (!this.model.emailAddress) {
        this.toastr.error('Email Address is required.');
        return;
      }
      if (!this.model.password) {
        this.toastr.error('Password is required.');
        return;
      }
      this.clientLogin();
    } else {
      if (!this.model.firstName) {
        this.toastr.error('First Name is required.');
        return;
      }
      if (!this.model.middleName) {
        this.toastr.error('Middle Name is required.');
        return;
      }
      if (!this.model.lastName) {
        this.toastr.error('Last name is required.');
        return;
      }
      if (!this.model.address) {
        this.toastr.error('Address is required.');
        return;
      }
      if (!this.model.mobileNo) {
        this.toastr.error('Mobile No. is required.');
        return;
      }
      if (!this.model.emailAddress) {
        this.toastr.error('Email address is required.');
        return;
      }
      if (!this.model.password) {
        this.toastr.error('Password is required.');
        return;
      }
      if (!this.model.confirmPassword) {
        this.toastr.error('Confirm Password is required.');
        return;
      }
      if (this.model.password !== this.model.confirmPassword) {
        this.toastr.error('Passwords do not match.');
        return;
      }
      this.signUp();
    }
  }

  signUp() {
    this.isProcessing = true;
    let httpResponse: IHttpResponse;
    this.userService.signUp(this.model)
      .pipe(finalize(() => {
        if (httpResponse?.success) {
          this.toastr.success(`Account successfully created. Kindly check your email to activate your account.`);
          this.close();
        } else {
          this.toastr.error(`Unable to create an account. ${httpResponse.message}`);
        }
        this.isProcessing = false;
      }))
      .subscribe((response: IHttpResponse) => httpResponse = response,
        error => {
          console.log(error);
          this.isProcessing = false;
        });
  }

  clientLogin() {
    this.isProcessing = true;
    let httpResponse: IHttpResponse;
    this.userService.login(this.model)
      .pipe(finalize(() => {
        if (httpResponse?.success) {
          this.toastr.success(`Successfully signed in.`);
          this.close();
          this.model = httpResponse.body;
          this.model.isAuthenticated = true;
          sessionStorage.setItem('user', JSON.stringify(this.model));
          if (this.model.admin) {
            this.router.navigate(['/admin-reservation']);
          } else {
            this.router.navigate(['/client-reservation']);
          }
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

  resetPassword() {
    this.otpModel = new OTP();
    this.stage = 1;
    this.otpTitle = "Request OTP";
    this.otpTimer = 0;
    this.passwordResetModal.open();
  }

  closeRP() {
    this.passwordResetModal.close();
  }

  requestOTP() {
    if (!this.otpModel.emailAddress) {
      this.toastr.error("Email address is required.");
      return;
    }

    this.isProcessing = true;
    let httpResponse: IHttpResponse;
    this.userService.requestOtp(this.otpModel)
      .pipe(finalize(() => {
        if (httpResponse?.success) {
          this.toastr.success("OTP successfully sent to your email.");
          const source = timer(1000, 1000);
          const abc = source.subscribe(val => {
            this.otpTimer = 60 - val;
          });
          this.otpTitle = "Resend OTP";
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

  validateOTP() {
    if (!this.otpModel.emailAddress) {
      this.toastr.error("Email address is required.");
      return;
    }
    if (!this.otpModel.otp) {
      this.toastr.error("OTP is required.");
      return;
    }

    this.isProcessing = true;
    let httpResponse: IHttpResponse;
    this.userService.validateOtp(this.otpModel)
      .pipe(finalize(() => {
        if (httpResponse?.success) {
          this.stage = 2;
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
  
  confirmReset() {
    if (!this.model.password) {
      this.toastr.error('Password is required.');
      return;
    }
    if (!this.model.confirmPassword) {
      this.toastr.error('Confirm Password is required.');
      return;
    }
    if (this.model.password !== this.model.confirmPassword) {
      this.toastr.error('Passwords do not match.');
      return;
    }
    this.model.emailAddress = this.otpModel.emailAddress;

    this.isProcessing = true;
    let httpResponse: IHttpResponse;
    this.userService.updatePassword(this.model)
      .pipe(finalize(() => {
        if (httpResponse?.success) {
          this.toastr.success("Password successfully updated.");
          this.model = new UserModel();
          this.closeRP();
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

  get resetPwMessage() {
    if (+this.stage === 1) {
      return 'To reset your password kindly provide the OTP sent to your email.';
    } else {
      return 'Enter your new password to reset your account.';
    }
  }
}
