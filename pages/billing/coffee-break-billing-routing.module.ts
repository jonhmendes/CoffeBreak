import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CoffeeBreakBillingPage } from './coffee-break-billing.page';

const routes: Routes = [
  {
    path: '',
    component: CoffeeBreakBillingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoffeeBreakBillingPageRoutingModule {}
