import { CoffeeBreak, Status } from './../../../../models/coffee-break';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { takeWhile, finalize } from 'rxjs/operators';
import { CoffeeBreakService } from '../../../../services/coffee-break.service';
import { UserService } from '@ons/ons-mobile-login';

@Component({
  selector: 'app-kitchen-product-status',
  templateUrl: './kitchen-product-status.component.html',
  styleUrls: ['./kitchen-product-status.component.scss']
})
export class KitchenProductStatusComponent implements OnInit {
  private componentActive = true;
  @Input() order: CoffeeBreak;
  status = Status;
  @Output() updateStatus = new EventEmitter<{
    success: boolean;
    error: any;
  }>();

  isCompleted = this.service.isCompleted;

  constructor(
    private service: CoffeeBreakService,
    private userService: UserService
  ) {}

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
    order.usuarioCozinha = this.userService.User.User_Full_Name;
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
