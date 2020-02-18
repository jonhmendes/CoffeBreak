import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/coffee-break/coffee-break.module').then(
        m => m.CoffeeBreakPageModule
      )
  },
  {
    path: 'order',
    loadChildren: () =>
      import('./pages/order/order.module').then(m => m.BasketPageModule)
  },
  {
    path: 'billing',
    loadChildren: () =>
      import('./pages/billing/coffee-break-billing.module').then(
        m => m.CoffeeBreakBillingPageModule
      )
  },
  {
    path: 'kitchen',
    loadChildren: () =>
      import('./pages/kitchen/coffee-break-kitchen.module').then(
        m => m.CoffeeBreakKitchenPageModule
      )
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoffeeBreakRoutingModule {}
