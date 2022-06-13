import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Optional, Package } from '../../models/package';

@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.css']
})
export class PackageComponent implements OnInit {

  @Input() item: Package;
  @Output() ngChangeOption = new EventEmitter<Package>();

  constructor() { }

  ngOnInit(): void {
  }

  onChangeOption() {
    this.ngChangeOption.emit(this.item);
  }

}
