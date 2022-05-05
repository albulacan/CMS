import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { BsModalService } from '../shared/directives/attribute/bs-modal.service';
import { IHttpResponse } from '../shared/models/http-response';
import { Menu } from '../shared/models/menu';
import { Package } from '../shared/models/package';
import { Reservation } from '../shared/models/reservation';
import { MenuService } from '../shared/services/menu.service';
import { PackageService } from '../shared/services/package.service';
import { ReservationService } from '../shared/services/reservation.service';
import { UserService } from '../shared/services/user.service';
import { UtilityService } from '../shared/services/utility.service';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {

  isProcessing = false;
  menus = [] as Menu[];
  packages = [] as Package[];
  model = new Reservation();

  cartModal: BsModalService;
  selectedCategory = '';
  badgeCount = 0;

  invalidDate = false;
  prevDate = '';

  isOthersSelected = false;
  timeFrom = '';
  timeTo = '';

  constructor(private packageService: PackageService,
    private menuService: MenuService,
    private toastr: ToastrService,
    public userService: UserService,
    private sanitizer: DomSanitizer,
    private reservationService: ReservationService,
    private utilService: UtilityService) { }

  ngOnInit(): void {
    this.getMenus();
    this.getPackages();
  }

  getMenus() {
    this.menus = [];
    this.isProcessing = true;
    let httpResponse: IHttpResponse;
    this.menuService.getAll()
      .pipe(finalize(() => {
        if (httpResponse?.success) {
          const result = httpResponse.body as Menu[];
          result?.forEach(x => {
            if (x.deleted) {
              return;
            }
            x.imagePath = this.sanitizer.bypassSecurityTrustResourceUrl(x.image);
            this.menus.push(x);
          });
        } else {
          this.toastr.error(`Unable to get menu. ${httpResponse.message}`);
        }
        this.isProcessing = false;
      }))
      .subscribe((response: IHttpResponse) => httpResponse = response,
        error => {
          console.log(error);
          this.isProcessing = false;
        });
  }

  getMenu(): Menu[] {
    if (!this.menus.length) {
      return [];
    }
    if (!this.selectedCategory) {
      return this.menus;
    }
    return this.menus.filter(x => x.category === this.selectedCategory);
  }

  getPackages() {
    this.packages = [];
    this.isProcessing = true;
    let httpResponse: IHttpResponse;
    this.packageService.getAll()
      .pipe(finalize(() => {
        if (httpResponse?.success) {
          const result = httpResponse.body as Package[];
          result?.forEach(x => {
            if (x.deleted) {
              return;
            }
            this.packages.push(x);
          });
        } else {
          this.toastr.error(`Unable to get packages. ${httpResponse.message}`);
        }
        this.isProcessing = false;
      }))
      .subscribe((response: IHttpResponse) => httpResponse = response,
        error => {
          console.log(error);
          this.isProcessing = false;
        });
  }

  occasionChange() {
    if (this.model.occasion === 'Others') {
      this.model.occasion = '';
      this.isOthersSelected = true;
    } else {
      this.isOthersSelected = false;
    }
  }

  onTimeChange(value: string) {
    console.log(value);
  }

  addPackageToCart(item: Package) {
    if (this.model?.packages?.find(x => +x.packageId === +item.packageId)) {
      this.toastr.error('Package already selected.');
      return;
    }
    this.badgeCount++;
    this.model.packages.push(JSON.parse(JSON.stringify(item)));
    this.model.amountDue = +this.model.amountDue + +item.price;
    this.toastr.success('Package successfully added.');
  }

  addMenuToCart(item: Menu) {
    this.badgeCount = +this.badgeCount + +item.quantity;
    if (this.model?.menus?.find(x => +x.menuId === +item.menuId)) {
      this.model.menus.map(x => {
        if (+x.menuId === +item.menuId) {
          x.quantity = +x.quantity + item.quantity;
        }
      });
    } else {
      this.model.menus.push(JSON.parse(JSON.stringify(item)));
    }
    this.model.amountDue = +this.model.amountDue + (+item.price * +item.quantity);
    this.toastr.success('Menu successfully added.');
  }

  remove(type: string, i: number) {
    if (type === 'package') {
      this.badgeCount--;
      this.model.amountDue = +this.model.amountDue - +this.model.packages[i].price;
      this.model.packages.splice(i, 1);
    } else {
      const qty = this.model.menus[i].quantity;
      this.badgeCount = +this.badgeCount - +qty;
      this.model.amountDue = +this.model.amountDue - (+this.model.menus[i].price * +this.model.menus[i].quantity);
      this.model.menus.splice(i, 1);
    }
  }

  getReservationByDate(date: string) {
    if (!date) {
      return;
    }
    if (this.prevDate === date) {
      return;
    }
    this.isProcessing = true;
    const request = new Reservation();
    request.date = this.utilService.toJsonDate(date);
    this.model.date = date;
    let httpResponse: IHttpResponse;
    this.reservationService.getByDate(request)
      .pipe(finalize(() => {
        if (httpResponse?.success) {
          if (httpResponse.body) {
            this.toastr.error('Selected date is not available.');
            this.invalidDate = true;
          } else {
            this.invalidDate = false;
          }
        } else {
          this.toastr.error(`Unable to get reservation. ${httpResponse.message}`);
        }
        this.prevDate = date;
        this.isProcessing = false;
      }))
      .subscribe((response: IHttpResponse) => httpResponse = response,
        error => {
          console.log(error);
          this.isProcessing = false;
        });
  }

  submit() {
    if (!this.model.venue) {
      this.toastr.error('Venue is required.');
      return;
    }
    if (!this.model.occasion) {
      this.toastr.error('Occasion is required.');
      return;
    }
    if (!this.model.pax) {
      this.toastr.error('No of Pax is required.');
      return;
    }
    if (!this.model.date) {
      this.toastr.error('Date of Event is required.');
      return;
    }
    if (!this.timeFrom) {
      this.toastr.error('Time of Event From is required.');
      return;
    }
    if (!this.timeTo) {
      this.toastr.error('Time of Event To is required.');
      return;
    }
    if (!this.model.tableService) {
      this.toastr.error('Table Service is required.');
      return;
    }
    if (!this.model.motif) {
      this.toastr.error('Event Motif is required.');
      return;
    }
    if (!this.model.theme) {
      this.toastr.error('Theme is required.');
      return;
    }
    if (!this.model.paymentOption) {
      this.toastr.error('Payment Option is required.');
      return;
    }
    if (!this.model.paymentMethod) {
      this.toastr.error('Payment Method is required.');
      return;
    }

    if (!this.model.packages?.length && !this.model.menus?.length) {
      this.toastr.error('Please select at least a package or menu.');
      return;
    }

    Swal.fire({
      title: 'Submit Reservation',
      text: "You are about to submit your reservation. Click Yes to proceed.",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this.model.time = `${this.timeFrom}-${this.timeTo}`;
        this.save();
      }
    });
  }

  save() {
    this.isProcessing = true;
    let httpResponse: IHttpResponse;
    this.model.date = this.utilService.toJsonDate(this.model.date);
    this.model.status = 'Pending';
    this.model.userId = this.userService.userDetails.userId;
    this.reservationService.save(this.model)
      .pipe(finalize(() => {
        if (httpResponse?.success) {
          this.model = new Reservation();
          this.badgeCount = 0;
          this.selectedCategory = '';
          this.prevDate = '';
          this.menus.map(x => {
            x.quantity = 0;
          });
          this.isOthersSelected = false;
          this.timeFrom = '';
          this.timeTo = '';
          Swal.fire(
            'Success!',
            'Your reservation request is successfully submitted. Kindly wait for our call to confirm your reservation. Thank you!',
            'success'
          );
        } else {
          this.toastr.error(`Unable to save reservation. ${httpResponse.message}`);
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
