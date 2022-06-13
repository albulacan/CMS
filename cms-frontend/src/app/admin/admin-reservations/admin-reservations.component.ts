import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { BsModalService } from 'src/app/shared/directives/attribute/bs-modal.service';
import { DataGridServerService } from 'src/app/shared/directives/attribute/data-grid-server.service';
import { DataGridFactory } from 'src/app/shared/directives/attribute/data-grid.factory';
import { IHttpResponse } from 'src/app/shared/models/http-response';
import { Payment, Reservation } from 'src/app/shared/models/reservation';
import { ReservationService } from 'src/app/shared/services/reservation.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Menu } from 'src/app/shared/models/menu';
import { Package } from 'src/app/shared/models/package';
import { PackageService } from 'src/app/shared/services/package.service';
import { MenuService } from 'src/app/shared/services/menu.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-admin-reservations',
  templateUrl: './admin-reservations.component.html',
  styleUrls: ['./admin-reservations.component.css']
})
export class AdminReservationsComponent implements OnInit {

  grid: DataGridServerService<Reservation>;
  filter = new Reservation();
  detailModal: BsModalService;
  imageModal: BsModalService;
  payment: Payment = new Payment();
  model = new Reservation();
  isProcessing = false;
  amountPaid = 0;
  origAmountPaid = 0;
  origStatus = '';

  menus = [] as Menu[];
  packages = [] as Package[];
  packageModal: BsModalService;
  menuModal: BsModalService;
  selectedCategory = '';

  constructor(private dgFactory: DataGridFactory,
    private toastr: ToastrService,
    private reservationService: ReservationService,
    private location: Location,
    private utilService: UtilityService,
    private packageService: PackageService,
    private menuService: MenuService,
    private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    const url = `${environment.apiUrl}reservation/get-data-grid`;
    this.grid = this.dgFactory.post({ url }, this.filter);
    this.getMenus();
    this.getPackages();
  }

  view(item: Reservation) {
    this.model = JSON.parse(JSON.stringify(item));
    this.model.packages.forEach(x => {
      if (x.optionals && x.optionals.length) {
        x.optionals.map(y => y.checked = true);
      }
      this.packages.forEach(y => {
        if (+y.packageId === +x.packageId) {
          y.selected = true;

          y.optionals.map(z => {
            if (x.optionals && x.optionals.length) {
              x.optionals.forEach(i => {
                if (i.description === z.description) {
                  z.checked = true;
                }
              });
            }
          });
        }
      });
    });
    this.amountPaid = 0;
    this.origAmountPaid = item.amountPaid;
    this.origStatus = item.status;
    this.selectedCategory = '';
    this.detailModal.open();
  }

  update() {
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
    if (!this.model.time) {
      this.toastr.error('Time of Event is required.');
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
    if (!this.model.packages?.length) {
      this.toastr.error('Please select at least a package.');
      return;
    }
    if (!this.model.menus?.length) {
      this.toastr.error('Please select a menu.');
      return;
    }
    if (!this.model.status) {
      this.toastr.error('Status is required.');
      return;
    }

    Swal.fire({
      title: 'Update Reservation',
      text: "Are you sure you want to update this reservation?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this.save();
      }
    });
  }

  calculateAmountPaid() {
    this.model.amountPaid = +this.origAmountPaid + (+this.amountPaid || 0);
  }

  getMenus() {
    this.menus = [];
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
      }))
      .subscribe((response: IHttpResponse) => httpResponse = response,
        error => {
          console.log(error);
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
    this.isProcessing = true;
    this.packages = [];
    let httpResponse: IHttpResponse;
    this.packageService.getAll()
      .pipe(finalize(() => {
        this.isProcessing = false;
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
      }))
      .subscribe((response: IHttpResponse) => httpResponse = response,
        error => {
          this.isProcessing = false;
          console.log(error);
        });
  }

  remove(type: string, i: number) {
    if (type === 'package') {
      this.packages.find(x => +x.packageId === +this.model.packages[i].packageId).selected = false;
      this.packages.find(x => +x.packageId === +this.model.packages[i].packageId).optionals.map(x => x.checked = false);
      this.model.packages.splice(i, 1);
    } else {
      // this.model.amountDue = +this.model.amountDue - (+this.model.menus[i].price * +this.model.menus[i].quantity);
      this.model.menus.splice(i, 1);
    }
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

  save() {
    this.isProcessing = true;
    let httpResponse: IHttpResponse;
    this.model.date = this.utilService.toJsonDate(this.model.date);
    this.model.amountDue = this.amountDue;
    this.reservationService.update(this.model)
      .pipe(finalize(() => {
        if (httpResponse?.success) {
          this.toastr.success('Reservation successfully updated.');
          this.model = new Reservation();
          this.amountPaid = 0;
          this.detailModal.close();
          this.grid.load();
        } else {
          this.toastr.error(`Unable to update reservation. ${httpResponse.message}`);
        }
        this.isProcessing = false;
      }))
      .subscribe((response: IHttpResponse) => httpResponse = response,
        error => {
          console.log(error);
          this.isProcessing = false;
        });
  }

  generateInvoice() {
    const baseUrl = this.location.prepareExternalUrl(this.location.path());
    window.open(`${baseUrl}/invoice/${this.model.referenceNo}`);
  }

  viewPoP(item: Payment) {
    item.imagePath = this.sanitizer.bypassSecurityTrustResourceUrl(item.attachment);
    this.payment = item;
    this.imageModal.open();
  }

  download(item: Payment) {
    const a = document.createElement('a');
    a.download = item.fileName;
    a.href = item.attachment;
    a.click();
  }

  get totalItem() {
    let total = this.model?.packages?.length || 0;
    this.model?.menus?.forEach(x => total = +total + +x.quantity);
    return total;
  }

  get disabled() {
    if (this.origStatus === 'Cancelled' || this.origStatus === 'Completed') {
      return true;
    }
    return false;
  }

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
}
