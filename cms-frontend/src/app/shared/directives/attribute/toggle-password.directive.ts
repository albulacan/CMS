import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appTogglePassword]'
})
export class TogglePasswordDirective {

  private _shown = false;

  constructor(private el: ElementRef) {
    const parent = this.el.nativeElement.parentNode;
    const img = document.createElement('img');
    img.src = "assets/images/show.png"
    img.style.width = "25px";
    img.style.height = "25px";
    img.style.position = "absolute";
    img.style.right = "5px";
    img.style.top = "6px";
    img.style.zIndex = "999";
    img.addEventListener('click', () => {
      this.toggle(img);
    });
    parent.appendChild(img);
  }

  toggle(img: HTMLImageElement) {
    this._shown = !this._shown;
    if (this._shown) {
      this.el.nativeElement.setAttribute('type', 'text');
      img.src = "assets/images/hide.png"
    } else {
      this.el.nativeElement.setAttribute('type', 'password');
      img.src = "assets/images/show.png"
    }
  }

}
