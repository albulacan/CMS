import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Menu } from '../../models/menu';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  @Input() menus: Menu[];
  @Input() showAddToCart: boolean;

  @Output() ngAddToCart = new EventEmitter<Menu>();

  constructor(private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  addToCart(item: Menu) {
    this.ngAddToCart.emit(item);
  }

}
