import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priceSum'
})
export class PriceSumPipe implements PipeTransform {
  transform(items: any[], ...args: any[]): any {
    if (!items || !items.length) {
      return 0;
    }
    return items.reduce((a: any, b: any) => a + b.produto.valor, 0);
  }
}
