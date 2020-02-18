import { Component, OnInit, Input } from '@angular/core';
import { CoffeeBreak, BaseType } from '../../models/coffee-break';
import { takeWhile, map, finalize, tap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { CoffeeBreakService } from '../../services/coffee-break.service';
import { ModalController } from '@ionic/angular';
import { RoomDateTimeComponent } from '../../components/room-date-time/room-date-time.component';
import { Observable } from 'rxjs';
import { Rooms } from '../../models/rooms';
import * as moment from 'moment';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss']
})
export class OrderPage implements OnInit {
  order: CoffeeBreak;
  formData: any;
  uas$: Observable<BaseType[]>;
  uas: BaseType[];
  total = 0;
  rooms: any[];
  rooms$: Observable<Rooms[]>;
  currentRoom: any;

  now = moment().format();
  minDate = () => {
    if (this.formData.date) {
      if (
        moment(this.formData.date).format('YYYY-MM-DD') !==
        moment(this.now).format('YYYY-MM-DD')
      ) {
        return moment(this.now)
          .add(1, 'day')
          .startOf('day')
          .format();
      }
    }
    return moment().format();
  };
  customMonthNames = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
  ];
  orderId: number;
  clone: boolean;
  private componentActive = true;
  constructor(
    private service: CoffeeBreakService,
    private router: Router,
    private modal: ModalController,
    private route: ActivatedRoute
  ) {}

  ionViewDidEnter() {}

  ngOnInit() {
    this.loadModel();
    this.loadRooms();
    this.uas$ = this.service
      .getUAs()
      .pipe(tap((uas: BaseType[]) => (this.uas = uas)));
    this.orderId = this.route.snapshot.params.id;
    this.clone = !!this.route.snapshot.url.find(
      u => u.path.indexOf('clone') >= 0
    );
    if (this.orderId) {
      return this.loadOrder(this.orderId, this.clone);
    }
  }

  changeRange(range: any) {
    this.formData.range = range;
  }

  reveiverRoom(rooms) {
    this.formData.room = rooms;
  }

  goBack() {
    if (!!this.orderId) {
      if (!!this.clone) {
        this.reset();
      }
      return this.router.navigate(['/apps/coffee-break/user']);
    }
    this.router.navigate(['/apps/coffee-break/user']);
  }

  async save() {
    if (!this.formData.date || !this.formData.hour) {
      return await this.service.showToast(
        'A data e hora do pedido são obrigatórias!'
      );
    }
    const date = `${this.formData.date.split('T')[0]}T${
      this.formData.hour.split('T')[1]
    }`;
    this.order = {
      ...this.order,
      ...this.formData,
      ...this.formData.range,
      ua: this.uas.find(x => this.formData.ua === x.id),
      data1: date,
      id: this.orderId,
      sala: !!this.formData.sala
        ? this.formData.sala
        : this.rooms.find(x => x.title === this.formData.room)
    };
    if (this.clone) {
      delete this.order.id;
    }
    delete (this.order as any).date;
    delete (this.order as any).hour;
    delete (this.order as any).range;
    delete (this.order as any).room;
    if (!!this.orderId && !this.clone) {
      return this.updateOrder();
    }
    const loading = await this.service.showLoading();
    this.service
      .save(this.order)
      .pipe(
        takeWhile(() => this.componentActive),
        finalize(() => loading.dismiss())
      )
      .subscribe(
        () => this.defaultSuccessAction(),
        err => {
          console.log('Error order: ', err);
          this.service.showToast('Error ao salvar pedido');
        }
      );
  }

  private async updateOrder() {
    const loading = await this.service.showLoading();
    this.service
      .update(this.orderId, this.order)
      .pipe(
        takeWhile(() => this.componentActive),
        finalize(() => loading.dismiss())
      )
      .subscribe(
        () => this.defaultSuccessAction(),
        err => {
          console.log('Error order: ', err);
          this.service.showToast('Error ao salvar pedido');
        }
      );
  }

  private defaultSuccessAction() {
    this.service.showToast('Salvo com sucesso!', 'success');
    this.reset();
    setTimeout(() => {
      this.router.navigate(['/apps/coffee-break/user']);
    }, 1500);
  }

  async selectRooms() {
    const modal = await this.modal.create({
      component: RoomDateTimeComponent,
      componentProps: { rooms: this.rooms },
      cssClass: 'bottom-modal-css',
      animated: true,
      showBackdrop: true
    });
    await modal.present();
    modal.onDidDismiss().then(({ data }) => {
      console.log('Selected room', data);
      if (data) {
        this.formData.room = data.title;
        this.formData.sala = data;
      }
    });
  }

  private async loadOrder(orderId: number, clone: boolean) {
    const loading = await this.service.showLoading();
    this.service
      .getOrders(orderId)
      .pipe(
        takeWhile(() => this.componentActive),
        finalize(() => loading.dismiss()),
        map((order: CoffeeBreak) => {
          this.formData = {
            id: order.id,
            ua: order.ua.id,
            room: order.sala.title,
            date: order.data1,
            hour: order.data1,
            range: {
              qtdPessoasMin: order.qtdPessoasMin,
              qtdPessoasMax: order.qtdPessoasMax,
              qtdCopos: order.qtdCopos
            }
          } as any;
          if (clone) {
            this.formData.date = null;
            this.formData.hour = null;
          }
          return order;
        })
      )
      .subscribe((order: CoffeeBreak) => {
        this.order = order;
      });
  }

  private loadModel() {
    this.order = {} as any;
    this.formData = {
      date: null,
      hour: null,
      room: null,
      ua: null,
      range: null
    };
  }

  private loadRooms() {
    this.service
      .getRooms()
      .pipe(
        tap((rooms: Rooms[]) => (this.rooms = rooms)),
        takeWhile(() => this.componentActive)
      )
      .subscribe(rooms => (this.rooms = rooms));
  }

  private reset() {
    this.total = 0;
    this.loadModel();
  }
}
