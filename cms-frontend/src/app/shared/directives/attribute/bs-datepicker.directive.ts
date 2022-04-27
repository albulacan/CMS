import { Directive, ElementRef, EventEmitter, Input, OnInit, HostListener } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

declare var $: any;
declare var moment: any;

@Directive({
  selector: '[appBsDatepicker]',
  outputs: [
    'ngChangeDate'
  ]
})
export class BsDatepickerDirective implements OnInit {

  ngChangeDate = new EventEmitter();
  @Input() appBsDatepicker: BsDatepickerOptions;

  isInit = false;

  constructor(private el: ElementRef, private toastr: ToastrService) {
  }

  ngOnInit() {
    if (!this.appBsDatepicker) {
      this.appBsDatepicker = {
        format: 'mm/dd/yyyy',
        disableFutureDates: false,
        autoclose: true,
        todayHighlight: true,
        disablePastDates: false
      };
    }
    $(this.el.nativeElement).datepicker({
      autoclose: this.appBsDatepicker.autoclose === undefined || this.appBsDatepicker.autoclose,
      todayHighlight: this.appBsDatepicker.todayHighlight === undefined || this.appBsDatepicker.todayHighlight,
      endDate: this.appBsDatepicker.disableFutureDates ? '-0d' : '',
      startDate: this.appBsDatepicker.disablePastAndPresentDate ? '+1d' : (this.appBsDatepicker.disablePastDates ? '+0d' : ''),
      format: this.format,
      forceParse: false,
      orientation: this.appBsDatepicker.orientation || ''
    }).on('changeDate', (e: any) => {
      this.ngChangeDate.emit(this.el.nativeElement.value);
    });
    this.el.nativeElement.autocomplete = 'off';
    this.isInit = true;
  }

  @HostListener('blur', ['$event']) onBlur(event: any) {
    if (this.isInit) {
      this.isInit = false;
      return;
    }
    const value: string = this.el.nativeElement.value;
    const date = moment(value, this.format.toUpperCase(), true);
    const yesterday = moment().subtract(1, 'd');
    if (value && !date.isValid()) {
      this.el.nativeElement.value = '';
      this.toastr.error('Invalid date format.');
    } else {
      if (this.appBsDatepicker.disablePastAndPresentDate && date.isBefore(moment())) {
        this.el.nativeElement.value = '';
        this.toastr.error('Current and past date is not allowed.');
      }
      if (this.appBsDatepicker.disablePastDates && date.isBefore(yesterday)) {
        this.el.nativeElement.value = '';
        this.toastr.error('Past date is not allowed.');
      }
      if (this.appBsDatepicker.disableFutureDates && date.isAfter(moment())) {
        this.el.nativeElement.value = '';
        this.toastr.error('Future date is not allowed.');
      }
    }
    this.ngChangeDate.emit(this.el.nativeElement.value);
  }

  get format() {
    return this.appBsDatepicker.format || 'mm/dd/yyyy';
  }

}

export interface BsDatepickerOptions {
  format?: string;
  disableFutureDates?: boolean;
  autoclose?: boolean;
  disablePastDates?: boolean;
  disablePastAndPresentDate?: boolean;
  todayHighlight?: boolean;
  orientation?: string;
}
