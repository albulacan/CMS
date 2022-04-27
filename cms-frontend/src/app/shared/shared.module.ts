import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockUiDirective } from './directives/attribute/block-ui.directive';
import { PaginationComponent } from './directives/element/pagination/pagination.component';
import { BsModalDirective } from './directives/attribute/bs-modal.directive';
import { BsSelectComponent } from './directives/element/bs-select/bs-select.component';
import { MenuComponent } from './components/menu/menu.component';
import { BsDatepickerDirective } from './directives/attribute/bs-datepicker.directive';
import { PackageComponent } from './components/package/package.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    BlockUiDirective,
    PaginationComponent,
    BsModalDirective,
    BsSelectComponent,
    MenuComponent,
    BsDatepickerDirective,
    PackageComponent
  ],
  exports: [
    BlockUiDirective,
    PaginationComponent,
    BsModalDirective,
    BsSelectComponent,
    MenuComponent,
    BsDatepickerDirective,
    PackageComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class SharedModule { }
