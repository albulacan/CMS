import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { IHttpResponse } from '../shared/models/http-response';
import { Menu } from '../shared/models/menu';
import { Package } from '../shared/models/package';
import { MenuService } from '../shared/services/menu.service';
import { PackageService } from '../shared/services/package.service';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  isProcessing = false;
  menus = [] as Menu[];
  packages = [] as Package[];
  showLogin = false;
  selectedCategory = '';

  constructor(private menuService: MenuService,
    private packageService: PackageService,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService,
    private router: Router,
    public userService: UserService) { }

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

  reserveNow() {
    if (this.userService.userDetails.isAuthenticated && !this.userService.userDetails.admin) {
      this.router.navigate(['/client-reservation']);
    } else {
      this.showLogin = true;
    }
  }

  

}
