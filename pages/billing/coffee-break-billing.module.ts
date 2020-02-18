import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CoffeeBreakBillingPageRoutingModule } from './coffee-break-billing-routing.module';

import { CoffeeBreakBillingPage } from './coffee-break-billing.page';
import { KitchenProductStatusComponent } from '../../components/kitchen-product-status/kitchen-product-status.component';
import { SharedModule } from '../../shared.module';
import { ContentLoaderModule } from '@ngneat/content-loader';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    IonicModule,
    ContentLoaderModule,
    CoffeeBreakBillingPageRoutingModule
  ],
  schemas: [NO_ERRORS_SCHEMA],
  declarations: [CoffeeBreakBillingPage, KitchenProductStatusComponent]
})
export class CoffeeBreakBillingPageModule {}
