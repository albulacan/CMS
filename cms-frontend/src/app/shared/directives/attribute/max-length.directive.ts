import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appMaxLength]'
})
export class MaxLengthDirective {

  @Input() appMaxLength: string;

  constructor(private el: ElementRef) { }

  @HostListener('keypress', ['$event']) onKeyPress(event: any) {
    if (!this.appMaxLength) {
      return;
    }
    const strValue = this.el.nativeElement.value as string;
    const value: string = strValue.substring(0, this.el.nativeElement.selectionStart) + event.key +
      strValue.substring(this.el.nativeElement.selectionEnd);
    if (!this.validateLength(value)) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event']) onPasteEvent(event: any) {
    const clipboardData = event.clipboardData || window['clipboardData'];
    const pastedText = clipboardData.getData('text');
    const current = this.el.nativeElement.value || '' as string;
    if (!this.validateLength(pastedText.concat(current))) {
      event.preventDefault();
    }
  }

  private validateLength(value: string) {
    let maxLength = 0;
    let maxDecimal = 10;
    if (this.appMaxLength.indexOf(',') > -1) {
      const args = this.appMaxLength.split(',');
      maxLength = parseInt(args[0] || '0', 10) + this.getAdditionalLength(value);
      maxDecimal = args.length > 1 ? parseInt(args[1] || '10', 10) : 10;
    } else {
      maxLength = parseInt(this.appMaxLength, 10);
    }
    if (value.indexOf('.') > -1 && maxDecimal > 0) {
      const decimal = value.substring(value.lastIndexOf('.') + 1);
      if (decimal.length > maxDecimal) {
        return false;
      }
    } else {
      if (value.length > maxLength) {
        return false;
      }
    }
    return true;
  }

  private getAdditionalLength(value: string) {
    let additional = 0;
    if (value.indexOf('-') > -1) {
      additional++;
    }
    if (value.indexOf(',') > -1) {
      additional = additional + (value.match(/,/g) || []).length;
    }
    return additional;
  }

}
