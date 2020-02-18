import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContentLoaderModule } from '@ngneat/content-loader';
import { IonicModule } from '@ionic/angular';

import { OrderPage } from './order.page';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared.module';
import { AmountOfPeopleAndCupComponent } from '../../components/amount-of-people-and-cup/amount-of-people-and-cup.component';
import { RoomDateTimeComponent } from '../../components/room-date-time/room-date-time.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ContentLoaderModule,
    RouterModule.forChild([
      { path: '', component: OrderPage },
      {
        path: ':id',
        component: OrderPage
      },
      {
        path: 'clone/:id',
        component: OrderPage
      }
    ])
  ],
  declarations: [
    OrderPage,
    AmountOfPeopleAndCupComponent,
    RoomDateTimeComponent
  ],
  entryComponents: [RoomDateTimeComponent]
})
export class BasketPageModule {}
