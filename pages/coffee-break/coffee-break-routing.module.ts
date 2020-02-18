import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CoffeeBreakPage } from './coffee-break.page';

const routes: Routes = [
  {
    path: 'user',
    component: CoffeeBreakPage,
    children:[
      { path: 'coffe-break',loadChildren:'../'},
      { path: 'faturamento',loadChildren:'../'},

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoffeeBreakPageRoutingModule {}
