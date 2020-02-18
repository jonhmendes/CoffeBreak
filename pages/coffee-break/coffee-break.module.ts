import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CoffeeBreakPageRoutingModule } from './coffee-break-routing.module';

import { CoffeeBreakPage } from './coffee-break.page';
import { ContentLoaderModule } from '@ngneat/content-loader';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContentLoaderModule,
    CoffeeBreakPageRoutingModule
  ],
  declarations: [CoffeeBreakPage],
  schemas: [NO_ERRORS_SCHEMA]
})
export class CoffeeBreakPageModule {}
