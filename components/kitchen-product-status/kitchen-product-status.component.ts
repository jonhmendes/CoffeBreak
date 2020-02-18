import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { CoffeeBreak, Status } from '../../models/coffee-break';
import { takeWhile, finalize } from 'rxjs/operators';
import { CoffeeBreakService } from '../../services/coffee-break.service';

@Component({
  selector: 'app-kitchen-product-status',
  templateUrl: './kitchen-product-status.component.html',
  styleUrls: ['./kitchen-product-status.component.scss']
})
export class KitchenProductStatusComponent implements OnInit, OnDestroy {
  private componentActive = true;
  @Input() order: CoffeeBreak;
  status = Status;
  @Output() updateStatus = new EventEmitter<{
    success: boolean;
    error: any;
  }>();
  isCompleted = (title: string) =>
    (title || '').toLowerCase() === 'Enviado' ||
    (title || '').toLowerCase() === 'recusado';

  constructor(private service: CoffeeBreakService) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.componentActive = false;
  }

  async onUpdateStatus($event: { order: CoffeeBreak; fase: any }) {
    const { order, fase } = $event;
    if (fase.selected) {
      return;
    }
    const selectedStatus = Status[fase.status];
    order.statusPedido.titulo = selectedStatus;
    const loading = await this.service.showLoading();
    this.service
      .update(order.id, order)
      .pipe(
        takeWhile(() => this.componentActive),
        finalize(() => loading.dismiss())
      )
      .subscribe(
        () => this.updateStatus.next({ success: true, error: null }),
        error => this.updateStatus.next({ success: false, error })
      );
  }
}
