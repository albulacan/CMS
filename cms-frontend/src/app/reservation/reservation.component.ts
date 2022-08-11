import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { BsModalService } from '../shared/directives/attribute/bs-modal.service';
import { IHttpResponse } from '../shared/models/http-response';
import { Menu } from '../shared/models/menu';
import { Optional, Package } from '../shared/models/package';
import { Payment, Reservation } from '../shared/models/reservation';
import { MenuService } from '../shared/services/menu.service';
import { PackageService } from '../shared/services/package.service';
import { ReservationService } from '../shared/services/reservation.service';
import { UserService } from '../shared/services/user.service';
import { UtilityService, _File } from '../shared/services/utility.service';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {

  isProcessing = false;
  isMenuProcessing = false;
  menus = [] as Menu[];
  packages = [] as Package[];
  model = new Reservation();
  payment = new Payment();

  cartModal: BsModalService;
  selectedCategory = '';
  badgeCount = 0;

  invalidDate = false;
  prevDate = '';

  isOthersSelected = false;
  timeFrom = '';
  fromAM = 'AM';
  timeTo = '';
  toAM = 'AM';

  doneMenu = 0;

  showAppointment = true;

  constructor(private packageService: PackageService,
    private menuService: MenuService,
    private toastr: ToastrService,
    public userService: UserService,
    private sanitizer: DomSanitizer,
    private reservationService: ReservationService,
    private utilService: UtilityService) { }

  ngOnInit(): void {
    this.menus = [];
    this.getMenuByCategory('Pork');
    this.getMenuByCategory('Beef');
    this.getMenuByCategory('Chicken');
    this.getMenuByCategory('Vegetable');
    this.getMenuByCategory('Pasta');
    this.getMenuByCategory('Appetizer');
    this.getMenuByCategory('Seafoods');
    this.getMenuByCategory('Soup with Meat');
    this.getMenuByCategory('Soup without Meat');
    this.getMenuByCategory('Drinks');
    this.getMenuByCategory('Dessert');
    this.getMenuByCategory('Others');
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

  getMenuByCategory(category: string) {
    this.isMenuProcessing = true;
    let httpResponse: IHttpResponse;
    this.menuService.getByCategory(category)
      .pipe(finalize(() => {
        if (httpResponse?.success) {
          this.doneMenu++;
          const result = httpResponse.body as Menu[];
          result?.forEach(x => {
            if (x.deleted) {
              return;
            }
            this.getMenuById(x.menuId);
            this.menus.push(x);
          });
        } else {
          this.toastr.error(`Unable to get menu. ${httpResponse.message}`);
        }
        this.isMenuProcessing = false;
      }))
      .subscribe((response: IHttpResponse) => httpResponse = response,
        error => {
          console.log(error);
          this.isMenuProcessing = false;
        });
  }

  getMenuById(id: number) {
    this.isMenuProcessing = true;
    let httpResponse: IHttpResponse;
    this.menuService.getById(id)
      .pipe(finalize(() => {
        if (httpResponse?.success) {
          const result = httpResponse.body as Menu;
          this.menus.map(x => {
            if (+x.menuId === +id) {
              x.imagePath = this.sanitizer.bypassSecurityTrustResourceUrl(result.image);
            }
          });
        } else {
          this.toastr.error(`Unable to get menu. ${httpResponse.message}`);
        }
        this.isMenuProcessing = false;
      }))
      .subscribe((response: IHttpResponse) => httpResponse = response,
        error => {
          console.log(error);
          this.isMenuProcessing = false;
        });
  }

  private setMenuProcessing() {
    if (this.isMenuProcessing && this.doneMenu === 12) {
      this.isMenuProcessing = false;
      this.doneMenu = 0;
    }
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

  onAttachmentChange(event: any) {
    this.utilService.getBase64(event).then((data: _File) => {
      this.payment.attachment = data?.base64;
      this.payment.fileName = data?.fileName;
    });
  }

  addPackageToCart(item: Package) {
    if (this.model?.packages?.find(x => +x.packageId === +item.packageId)) {
      this.toastr.error('Package already selected.');
      return;
    }
    this.packages.find(x => +x.packageId === +item.packageId).selected = true;
    this.model.packages.push(JSON.parse(JSON.stringify(item)));
    this.toastr.success('Package successfully added.');
  }

  addOption(item: Package) {
    this.model.packages.find(x => +x.packageId === +item.packageId).optionals = item.optionals;
  }

  mains = ['Pork', 'Beef', 'Chicken', 'Fish', 'Vegetable'];

  addMenuToCart(item: Menu) {
    const mains = this.model.menus.filter(x => this.mains.includes(x.category)).length;
    if (mains >= 4) {
      this.toastr.error('Only 4 main courses can be added to order.');
      return;
    }
    const _found = this.model.menus.find(x => x.category === item.category);
    if (_found) {
      this.toastr.error('Only 1 menu per category can be selected.');
      return;
    }
    this.model.menus.push(JSON.parse(JSON.stringify(item)))
    this.toastr.success('Menu successfully added.');
  }

  remove(type: string, i: number) {
    if (type === 'package') {
      this.badgeCount--;
      this.packages.find(x => +x.packageId === +this.model.packages[i].packageId).selected = false;
      this.packages.find(x => +x.packageId === +this.model.packages[i].packageId).optionals.map(x => x.checked = false);
      this.model.packages.splice(i, 1);
    } else {
      const qty = this.model.menus[i].quantity;
      this.badgeCount = +this.badgeCount - +qty;
      // this.model.amountDue = +this.model.amountDue - (+this.model.menus[i].price * +this.model.menus[i].quantity);
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
    this.showAppointment = false;
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
        this.showAppointment = true;
      }))
      .subscribe((response: IHttpResponse) => httpResponse = response,
        error => {
          console.log(error);
          this.isProcessing = false;
          this.showAppointment = true;
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
    if (this.model.paymentMethod === 'Cash' && !this.model.appointmentDate) {
      this.toastr.error('Appointment Date for Payment is required.');
      return;
    }
    if (this.model.paymentMethod === 'Gcash') {
      if (!+this.payment.amount) {
        this.toastr.error('Amount Paid is required.');
        return;
      }
      if (!this.payment.attachment) {
        this.toastr.error('Proof of Payment is required.');
        return;
      }
    }

    if (!this.model.packages?.length) {
      this.toastr.error('Please select at least a package.');
      return;
    }

    if (!this.model.menus?.length) {
      this.toastr.error('Please select a menu.');
      return;
    }

    if (this.model.paymentMethod === 'Gcash') {
      if (this.model.paymentOption === 'Down Payment') {
        const dp = 5000;
        if (+this.payment.amount < dp) {
          this.toastr.error(`Please pay at least P${dp}.00 for down payment.`);
          return;
        }
      } else {
        if (+this.payment.amount !== +this.model.amountDue) {
          this.toastr.error('Please settle your payment in full.');
          return;
        }
      }
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
        this.model.time = `${this.timeFrom}${this.fromAM}-${this.timeTo}${this.toAM}`;
        if (this.model.paymentMethod === 'Gcash') {
          this.model.amountPaid = this.payment.amount;
          this.model.payments.push(this.payment);
        }
        this.save();
      }
    });
  }

  save() {
    this.isProcessing = true;
    let httpResponse: IHttpResponse;
    this.model.date = this.utilService.toJsonDate(this.model.date);
    this.model.appointmentDate = this.utilService.toJsonDate(this.model.appointmentDate);
    this.model.status = 'Pending';
    this.model.userId = this.userService.userDetails.userId;
    this.model.amountDue = this.amountDue;
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
          this.fromAM = 'AM';
          this.toAM = 'AM';
          this.packages.map(x => {
            x.selected = false;
            x.optionals.map(y => y.checked = false);
          });
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

  // getter

  get amountDue() {
    if (!this.model || !this.model.packages) {
      return 0;
    }
    let amountDue = 0;
    this.model.packages.forEach(x => {
      amountDue = +amountDue + +x.price;
      if (x.optionals && x.optionals.length) {
        x.optionals.forEach(y => {
          if (y.checked) {
            amountDue = +amountDue + y.price;
          }
        });
      }
    });
    return amountDue;
  }

  get appointmentEndDate() {
    if (!this.model.date) {
      return '';
    }
    const d = new Date(this.model.date);
    d.setDate(d.getDate() - 1);
    return d;
  }


}
