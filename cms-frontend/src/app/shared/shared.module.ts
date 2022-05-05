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
import { TimeFormatDirective } from './directives/attribute/time-format.directive';
import { MaxLengthDirective } from './directives/attribute/max-length.directive';
import { TogglePasswordDirective } from './directives/attribute/toggle-password.directive';

@NgModule({
  declarations: [
    BlockUiDirective,
    PaginationComponent,
    BsModalDirective,
    BsSelectComponent,
    MenuComponent,
    BsDatepickerDirective,
    PackageComponent,
    TimeFormatDirective,
    MaxLengthDirective,
    TogglePasswordDirective
  ],
  exports: [
    BlockUiDirective,
    PaginationComponent,
    BsModalDirective,
    BsSelectComponent,
    MenuComponent,
    BsDatepickerDirective,
    PackageComponent,
    TimeFormatDirective,
    MaxLengthDirective,
    TogglePasswordDirective
  ],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class SharedModule { }
