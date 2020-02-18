import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonSlides,
  IonList,
  NavController,
  IonItemSliding
} from '@ionic/angular';
import { takeWhile, finalize, tap, map } from 'rxjs/operators';
import { CoffeeBreakService } from '../../services/coffee-break.service';
import { Observable } from 'rxjs';
import { UIServices } from 'src/app/services/ui.service';
import { CoffeeBreak } from '../../models/coffee-break';

@Component({
  selector: 'app-coffee-break',
  templateUrl: './coffee-break.page.html',
  styleUrls: ['./coffee-break.page.scss']
})
export class CoffeeBreakPage implements OnInit, OnDestroy {
  private componentActive = true;
  orders$: Observable<CoffeeBreak[]>;
  private originOrders: CoffeeBreak[];
  public fakeList = [1, 2, 3, 4, 5];
  isLoading: boolean;
  @ViewChild(IonItemSliding, { static: true }) ionItemSliding: IonItemSliding;
  isCompleted = this.service.isCompleted;

  constructor(
    private service: CoffeeBreakService,
    private router: NavController,
    private route: Router,
    private uiService: UIServices
  ) {}

  ionViewDidEnter() {
    this.loadOrders();
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.componentActive = false;
  }

  details(id?: number) {
    this.router.navigateRoot(['/apps/snack/kitchen/details', id]);
  }

  goBack() {
    this.router.navigateRoot(['/home']);
  }
  async cancel(orderId: number) {
    await this.uiService.showOnsAlert({
      titulo: 'Atenção',
      descricao: 'Deseja realmente cancelar este pedido?',
      buttons: [
        {
          label: 'Sim',
          cor: 'is-success',
          acao: () => this.cancelOrder(orderId)
        },
        {
          label: 'Não',
          cor: 'is-danger',
          acao: () => {}
        }
      ],
      mostrarFechar: false
    });
  }

  private async cancelOrder(orderId: number) {
    const loading = await this.service.showLoading();
    this.service
      .cancelOrder(orderId)
      .pipe(
        finalize(() => loading.dismiss()),
        takeWhile(() => this.componentActive)
      )
      .subscribe(
        () => {
          this.service.showToast('Pedido cancelado com sucesso', 'success');
          this.loadOrders();
        },
        error => {
          this.service.showToast('Erro ao cancelar pedido');
          console.log('Error ', error);
        }
      );
  }
  async markReceived(orderId: number) {
    const loading = await this.service.showLoading();
    const order = this.originOrders.find(o => o.id === orderId);
    order.statusPedido.titulo = 'Recebido';
    this.service
      .update(orderId, order)
      .pipe(
        finalize(() => loading.dismiss()),
        takeWhile(() => this.componentActive)
      )
      .subscribe(
        () => {
          this.service.showToast('Pedido marcado como Recebido ', 'success');
          this.loadOrders();
        },
        error => {
          this.service.showToast('Erro ao marcar pedido como Recebido ');
          console.log('Error ', error);
        }
      );
  }
  edit(orderId: number) {
    this.router.navigateRoot(['apps/coffee-break/order', orderId]);
  }

  repeat(orderId: number) {
    this.router.navigateRoot(['apps/coffee-break/order/clone', orderId], {
      queryParams: { clone: true }
    });
  }

  private loadOrders() {
    this.ionItemSliding.closeOpened();
    this.isLoading = true;
    this.orders$ = this.service.getOrders().pipe(
      tap(orders => (this.originOrders = orders as CoffeeBreak[])),
      finalize(() => (this.isLoading = false))
    ) as Observable<CoffeeBreak[]>;
  }

  newRequest() {
    this.route.navigate(['apps/coffee-break/order']);
  }

  // const newlis = [...icon].forEach((li, idx) => {
  //   const i = document.createElement('i');
  //   i.className = "far " + awesomeIcons[idx];
  //   ul.insertBefore(i, li);
  // });
}
