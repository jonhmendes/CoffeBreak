import { OnsBaseService } from '@ons/ons-mobile-login';
import { of, Subject, Observable } from 'rxjs';
import { random, orderBy } from 'lodash';
import { environment } from 'src/environments/environment';
import { map, tap } from 'rxjs/operators';
import { ToastController, LoadingController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Status, CoffeeBreak, BaseType } from '../models/coffee-break';
import * as moment from 'moment';
import { HttpHeaders } from '@angular/common/http';
import { clone, sortBy } from 'lodash';
import { Rooms } from '../models/rooms';

@Injectable({
  providedIn: 'root'
})
export class CoffeeBreakService {
  public snacks: CoffeeBreak;
  public snackChange$ = new Subject<CoffeeBreak>();
  private urlBase = `${environment.MOCK_SERVER}/coffee-break`;

  constructor(
    private http: OnsBaseService,
    private toast: ToastController,
    private loading: LoadingController
  ) {}

  getRooms() {
    return this.http.get<Rooms[]>(`${this.urlBase}/salas`);
  }

  getUAs() {
    return this.http.get<BaseType[]>(`${this.urlBase}/ua`);
  }

  getRules() {
    return this.http.get<any[]>(`${this.urlBase}/regras`);
  }

  getOrders(id?: number): Observable<CoffeeBreak | CoffeeBreak[]> {
    return this.http
      .get<CoffeeBreak | CoffeeBreak[]>(
        `${this.urlBase}${id ? '/' + id : ''}`,
        undefined,
        undefined,
        false
      )
      .pipe(
        map((order: CoffeeBreak | CoffeeBreak[]) => {
          if (Array.isArray(order)) {
            return orderBy(order, ['data1'], ['desc']);
          }
          return order;
        }),
        map((order: CoffeeBreak | CoffeeBreak[]) => this.mapFases(order))
      );
  }

  save(coffe: CoffeeBreak): Observable<CoffeeBreak> {
    coffe.statusPedido = {
      id: random(9999),
      titulo: Status[Status.Enviado]
    };
    return this.http.post<CoffeeBreak>(
      `${this.urlBase}`,
      coffe,
      undefined,
      undefined,
      false
    );
  }

  update(id: number, order: Partial<CoffeeBreak>) {
    return this.http.put<CoffeeBreak>(
      `${this.urlBase}/${id}`,
      order,
      undefined,
      undefined,
      false
    );
  }

  cancelOrder(id: number) {
    return this.http.delete(
      `${this.urlBase}/${id}`,
      undefined,
      undefined,
      false
    );
  }

  filter(filter: { start: string; end: string }) {
    if (!filter) {
      return this.http.get(`${this.urlBase}/faturamento`);
    }
    return this.http
      .post<any>(
        `${this.urlBase}/faturamento/por-periodo`,
        filter,
        undefined,
        undefined,
        false
      )
      .pipe(map((order: CoffeeBreak | CoffeeBreak[]) => this.mapFases(order)));
  }

  sendReport(start: string, end: string) {
    return this.http
      .post(
        `${this.urlBase}/faturamento/enviar-relatorio`,
        { start, end },
        undefined,
        {
          headers: new HttpHeaders({
            Accept: 'application/vnd.ms-excel'
          }),
          responseType: 'blob' as 'blob'
        },
        false
      )
      .pipe(
        map(
          (res: any) => new Blob([res], { type: 'application/vnd.ms-excel' })
        ),
        tap((data: Blob) => {
          console.log(`Send report mock start: ${start} - end: ${end}`);
          this.downloadFile(data, start, end);
        })
      );
  }

  downloadFile(data: Blob, start: string, end: string) {
    const url = window.URL.createObjectURL(data);

    // Debe haber una manera mejor de hacer esto...
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = url;
    a.download = `Faturamento_${moment(start).format('DD-MM')}_${moment(
      end
    ).format('DD-MM')}.xls`;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove(); // remove the element
  }

  async showToast(message: string, color = 'danger') {
    const toast = await this.toast.create({
      message,
      color,
      duration: 3000,
      position: 'bottom'
    });
    await toast.present();
    return toast;
  }

  async showLoading(message?: string) {
    const loading = await this.loading.create({
      message: message || 'Aguarde...',
      duration: 15000
    });
    await loading.present();
    return loading;
  }
  markStatus(s: any) {
    const statusPedido = [
      {
        index: 0,
        status: Status.Enviado,
        icon: '',
        selected: false
      },
      {
        index: 0,
        status: Status.Cozinha,
        icon: 'anotacao',
        selected: false
      },
      {
        index: 1,
        status: Status['Em Preparo'],
        icon: 'panela',
        selected: false
      },
      {
        index: 2,
        status: Status['Saindo para entrega'],
        icon: 'entrega',
        selected: false
      },
      {
        index: 3,
        status: Status.Entregue,
        icon: 'prato',
        selected: false
      },
      {
        index: 4,
        status: Status.Recebido,
        icon: '',
        selected: false
      }
    ];
    const status = {
      titulo: null
    };
    if (typeof s === 'string') {
      status.titulo = clone(s);
      s = status;
    }
    s.fases = statusPedido;
    for (const fase of s.fases) {
      fase.selected = true;
      if (fase.status === Status[s.titulo]) {
        break;
      }
    }
    return s;
  }

  isCompleted(title: string): boolean {
    return (
      (title || '').toLowerCase() === 'recebido' ||
      (title || '').toLowerCase() === 'entregue' ||
      (title || '').toLowerCase() === 'recusado'
    );
  }

  private mapFases(order: CoffeeBreak | CoffeeBreak[]) {
    const maps = o => {
      (o.statusPedido as any) = this.markStatus(o.statusPedido);
      let fases = (o.statusPedido as any).fases as any[];
      fases = fases.filter(f => !!f.icon);
      (o.statusPedido as any).fases = fases;
      return o;
    };
    if (Array.isArray(order)) {
      order = order.map(o => maps(o));
    } else {
      order = maps(order);
    }
    return order;
  }
}
