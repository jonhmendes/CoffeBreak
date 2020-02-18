import { CoffeeBreak, Status } from './../../models/coffee-break';
import { UIServices } from './../../../../services/ui.service';
import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { NavController } from '@ionic/angular';
import { tap, finalize } from 'rxjs/operators';
import { CoffeeBreakService } from '../../services/coffee-break.service';

@Component({
  selector: 'app-coffee-break-kitchen',
  templateUrl: './coffee-break-kitchen.page.html',
  styleUrls: ['./coffee-break-kitchen.page.scss']
})
export class CoffeeBreakKitchenPage implements OnInit {
  private componentActive = true;
  originOrders: CoffeeBreak[];
  orders$: Observable<CoffeeBreak[]>;
  status = Status;
  public fakeList = [1, 2, 3, 4, 5];
  isLoading: boolean;
  isCompleted = this.service.isCompleted;

  constructor(
    private service: CoffeeBreakService,
    private router: NavController,
    private uiService: UIServices
  ) {}

  ngOnInit() {
    this.loadOrders();
  }

  ngOnDestroy() {
    this.componentActive = false;
  }

  details(id?: number) {
    this.router.navigateRoot(['/apps/snack/kitchen/details', id]);
  }

  goBack() {
    this.router.navigateRoot(['/home']);
  }

  async updateStatus($event: { success: boolean; error: any }) {
    if ($event.success) {
      this.service.showToast('Atualizado com sucesso', 'success');
      this.loadOrders();
    } else {
      this.service.showToast('Erro ao atualizar status');
      console.log('Error update status ', $event.error);
    }
  }

  private loadOrders() {
    this.isLoading = true;
    this.orders$ = this.service.getOrders().pipe(
      tap(orders => (this.originOrders = orders as CoffeeBreak[])),
      finalize(() => (this.isLoading = false))
    ) as Observable<CoffeeBreak[]>;
  }
}
