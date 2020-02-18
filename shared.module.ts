import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnumTextPipe } from './pipes/enum-text.pipe';
import { PriceSumPipe } from './pipes/price-sum.pipe';

@NgModule({
  declarations: [EnumTextPipe, PriceSumPipe],
  exports: [EnumTextPipe, PriceSumPipe],
  imports: [CommonModule]
})
export class SharedModule {}
