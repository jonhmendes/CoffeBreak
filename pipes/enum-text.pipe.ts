import { Status } from './../models/coffee-break';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enumText'
})
export class EnumTextPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    if (typeof value === 'number') {
      return Status[value];
    }
    return value;
  }
}
