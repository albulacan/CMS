import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appTimeFormat]'
})
export class TimeFormatDirective {

  constructor(private el: ElementRef) {
  }

  @HostListener('input', ['$event']) onInputChange(event: any) {
      let value: string = this.el.nativeElement.value;
      value = value.replace(/[^0-9]/g, '');
      if (!value || (value && value.indexOf('%') > -1) || value.length === 5) {
        event.preventDefault();
      }
      value = this.formatTime(value);
      this.el.nativeElement.value = value;
  }

  private formatTime(value: string) {
      const length = value.length;

      if (+value.substring(0, 2) > 23) {
        value = 23 + ':' + value.substring(2, length);
      }

      if (length > 2) {
      if (value.indexOf(':') > -1) {
        } else {
          value = value.substring(0, 2) + ':' + value.substring(2, length);
        }
      }

      if (+value.substring( 3, 5) > 59 ) {
        value = value.substring(0, 2) + ':' + 59;
      }

      return value;
  }

}
