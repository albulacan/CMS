import { Component, Input, OnInit } from '@angular/core';
import { Package } from '../../models/package';

@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.css']
})
export class PackageComponent implements OnInit {

  @Input() item: Package;

  constructor() { }

  ngOnInit(): void {
  }

}
