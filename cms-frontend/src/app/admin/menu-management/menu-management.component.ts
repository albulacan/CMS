import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BsModalService } from 'src/app/shared/directives/attribute/bs-modal.service';
import { DataGridServerService } from 'src/app/shared/directives/attribute/data-grid-server.service';
import { DataGridFactory } from 'src/app/shared/directives/attribute/data-grid.factory';
import { IHttpResponse } from 'src/app/shared/models/http-response';
import { Menu } from 'src/app/shared/models/menu';
import { MenuService } from 'src/app/shared/services/menu.service';
import { UtilityService, _File } from 'src/app/shared/services/utility.service';
import { environment } from 'src/environments/environment';
import { finalize } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-menu-management',
  templateUrl: './menu-management.component.html',
  styleUrls: ['./menu-management.component.css']
})
export class MenuManagementComponent implements OnInit {

  grid: DataGridServerService<Menu>;
  model: Menu = new Menu();
  modal: BsModalService;
  filter = new Menu();
  isProcessing = false;

  constructor(private dgFactory: DataGridFactory,
    private toastr: ToastrService,
    private utilService: UtilityService,
    private menuService: MenuService,
    private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    const url = `${environment.apiUrl}menu/get-data-grid`;
    this.grid = this.dgFactory.post({ url }, this.filter);
  }

  getImage(item: Menu) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(item.image);
  }

  view(item: Menu) {
    this.model = JSON.parse(JSON.stringify(item));
    this.modal.open();
  }

  add() {
    this.model = new Menu();
    this.modal.open();
  }

  close() {
    this.modal.close();
  }

  onImageChange(event: any) {
    this.utilService.getBase64(event).then((data: _File) => {
      this.model.image = data?.base64;
      this.model.fileName = data?.fileName;
      this.model.extension = data?.extension;
    });
  }

  save() {
    if (!this.model.name) {
      this.toastr.error('Name is required.');
      return;
    }
    if (!this.model.description) {
      this.toastr.error('Description is required.');
      return;
    }
    if (!this.model.category) {
      this.toastr.error('Category is required.');
      return;
    }
    if (!this.model.image) {
      this.toastr.error('Image is required.');
      return;
    }
    if (!this.model.price) {
      this.toastr.error('Price is required.');
      return;
    }

    this.setSave();
  }

  delete(item: Menu) {
    Swal.fire({
      title: 'Delete Menu',
      text: "Are you sure you want to delete this menu?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this.model = item;
        this.model.deleted = true;
        this.setSave(true);
      }
    });
  }

  setSave(isDelete?: boolean) {
    this.isProcessing = true;
    let httpResponse: IHttpResponse;
    this.menuService.save(this.model)
      .pipe(finalize(() => {
        if (httpResponse?.success) {
          this.toastr.success(`Menu successfully ${isDelete ? 'deleted' : 'saved'}.`);
          this.close();
          this.grid.load();
        } else {
          this.toastr.error(`Unable to ${isDelete ? 'dele' : 'save'} menu. ${httpResponse.message}`);
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

