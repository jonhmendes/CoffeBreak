import { SharedModule } from './../../shared.module';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CoffeeBreakKitchenPageRoutingModule } from './coffee-break-kitchen-routing.module';

import { CoffeeBreakKitchenPage } from './coffee-break-kitchen.page';
import { KitchenProductStatusComponent } from './components/kitchen-product-status/kitchen-product-status.component';
import { ContentLoaderModule } from '@ngneat/content-loader';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ContentLoaderModule,
    CoffeeBreakKitchenPageRoutingModule
  ],
  declarations: [CoffeeBreakKitchenPage, KitchenProductStatusComponent]
})
export class CoffeeBreakKitchenPageModule {}
