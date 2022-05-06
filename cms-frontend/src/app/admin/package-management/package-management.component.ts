import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { BsModalService } from 'src/app/shared/directives/attribute/bs-modal.service';
import { DataGridServerService } from 'src/app/shared/directives/attribute/data-grid-server.service';
import { DataGridFactory } from 'src/app/shared/directives/attribute/data-grid.factory';
import { IHttpResponse } from 'src/app/shared/models/http-response';
import { Package } from 'src/app/shared/models/package';
import { PackageService } from 'src/app/shared/services/package.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-package-management',
  templateUrl: './package-management.component.html',
  styleUrls: ['./package-management.component.css']
})
export class PackageManagementComponent implements OnInit {

  grid: DataGridServerService<Package>;
  model: Package = new Package();
  modal: BsModalService;
  filter = new Package();
  isProcessing = false;

  constructor(private dgFactory: DataGridFactory,
    private toastr: ToastrService,
    private packageService: PackageService) { }

  ngOnInit(): void {
    const url = `${environment.apiUrl}package/get-data-grid`;
    this.grid = this.dgFactory.post({ url }, this.filter);
  }

  view(item: Package) {
    this.model = JSON.parse(JSON.stringify(item));
    this.modal.open();
  }

  add() {
    this.model = new Package();
    this.modal.open();
  }

  close() {
    this.modal.close();
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
    if (!this.model.pax) {
      this.toastr.error('No. of Pax is required.');
      return;
    }
    if (!this.model.price) {
      this.toastr.error('Price is required.');
      return;
    }

    this.setSave();
  }

  delete(item: Package) {
    Swal.fire({
      title: 'Delete Package',
      text: "Are you sure you want to delete this package?",
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
    this.packageService.save(this.model)
      .pipe(finalize(() => {
        if (httpResponse?.success) {
          this.toastr.success(`Package successfully ${isDelete ? 'deleted' : 'saved'}.`);
          this.close();
          this.grid.load();
        } else {
          this.toastr.error(`Unable to ${isDelete ? 'dele' : 'save'} package. ${httpResponse.message}`);
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
