import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor() { }

  public getBase64(event: any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      if (event.target.files && event.target.files.length > 0) {
        const file = event.target.files[0];
        reader.readAsDataURL(file);
        reader.onload = () => {
          const data = {} as _File;
          data.base64 = reader.result.toString();
          data.fileName = event.target.files[0].name;
          data.extension = event.target.files[0].type;
          resolve(data);
        };
        reader.onerror = error => reject(error);
      } else {
        resolve(null);
      }
    });
  }

  public toJsonDate(date: string) {
    return this.formatDate(date, 'yyyy-MM-dd');
  }

  public formatDate(date: string, format: string) {
    if (!date) {
      return '';
    }
    const validFormats: string[] = ['MM/dd/yyyy', 'dd/MM/yyyy', 'yyyy/MM/dd', 'yyyy/dd/MM',
      'MM-dd-yyyy', 'dd-MM-yyyy', 'yyyy-MM-dd', 'yyyy-dd-MM', 'MM/dd/yyyy HH:mm'];
    // Return orig date if not valid format
    if (!format || !(validFormats.indexOf(format) > -1)) {
      return date;
    }
    const tmpDate: Date = new Date(date);
    const day: string = this.toStringDigit(tmpDate.getDate());
    const month: string = this.toStringDigit(tmpDate.getMonth() + 1);
    const year: string = tmpDate.getFullYear().toString();
    const hh: string = this.toStringDigit(tmpDate.getHours());
    const mm: string = this.toStringDigit(tmpDate.getMinutes());
    return format.replace('MM', month).replace('dd', day).replace('yyyy', year).replace('HH', hh).replace('mm', mm);
  }

  private toStringDigit(val: any) {
    const str: string = val ? val.toString() : '00';
    return str.length === 1 ? `0${str}` : str;
  }
}

export interface _File {
  fileName: string;
  base64: string;
  extension: string;
  size: string;
}
