import { CoffeeBreak, Status } from './../../models/coffee-break';
import { random, clone } from 'lodash';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { tap, takeWhile, finalize } from 'rxjs/operators';
import { IonSlides, NavController } from '@ionic/angular';
import { CoffeeBreakService } from '../../services/coffee-break.service';
import { UIServices } from 'src/app/services/ui.service';

export interface RangeDate {
  id?: number;
  start: string;
  end: string;
  selected?: boolean;
}

@Component({
  selector: 'app-coffee-break-billing',
  templateUrl: './coffee-break-billing.page.html',
  styleUrls: ['./coffee-break-billing.page.scss']
})
export class CoffeeBreakBillingPage implements OnInit {
  private componentActive = true;
  originOrders: CoffeeBreak[];
  orders$: Observable<CoffeeBreak[]>;
  status = Status;
  public fakeList = [1, 2, 3, 4, 5];
  isLoading: boolean;
  @ViewChild('slides', { static: true }) slides: IonSlides;
  startDate: string;
  endDate: string;
  private _baseMonth: moment.Moment;
  public get baseMonth(): moment.Moment {
    return this._baseMonth;
  }
  public set baseMonth(v: moment.Moment) {
    this._baseMonth = v;
    this.generateRangeDates(v);
    this.loadOrderFromCurrentMonth();
  }
  month: string;
  ranges: RangeDate[] = [];
  total: number;
  selectedFilter: RangeDate;

  constructor(
    private service: CoffeeBreakService,
    private router: NavController,
    private uiService: UIServices
  ) {}

  next() {
    this.slides.slideNext();
  }

  prev() {
    this.slides.slidePrev();
  }
  ngOnInit() {
    this.loadDates();
    this.loadOrderFromCurrentMonth();
  }

  ngOnDestroy() {
    this.componentActive = false;
  }

  goBack() {
    this.router.navigateRoot(['/home']);
  }

  minusOne() {
    this.changeMonth(-1);
  }
  plusOne() {
    this.changeMonth(1);
  }

  async filter(range: RangeDate) {
    range.selected = !range.selected;
    this.selectedFilter = range;
    if (!range.selected) {
      this.selectedFilter = null;
      return await this.loadOrderFromCurrentMonth();
    }
    this.ranges
      .filter(x => x.id !== range.id)
      .forEach(r => (r.selected = false));
    this.loadOrders(range.start, range.end);
  }

  async sendReport() {
    await this.uiService.showLoading();
    const dates = {
      start: this.baseMonth.startOf('M').format(),
      end: this.baseMonth.endOf('M').format()
    };
    if (this.selectedFilter && this.selectedFilter.selected) {
      dates.start = this.selectedFilter.start;
      dates.end = this.selectedFilter.end;
    }
    this.service
      .sendReport(dates.start, dates.end)
      .pipe(
        finalize(() => this.uiService.showLoading(false)),
        takeWhile(() => this.componentActive)
      )
      .subscribe(
        () => {
          this.service.showToast(
            'Relatório enviado com sucesso. Verifique seu email',
            'success'
          );
        },
        error => {
          this.service.showToast('Error ao gerar relatório');
          console.log('Error ', error);
        }
      );
  }

  private async loadOrderFromCurrentMonth() {
    await this.loadOrders(
      this.baseMonth.startOf('M').format(),
      this.baseMonth.endOf('M').format()
    );
  }

  private loadOrders(start: string, end: string) {
    this.isLoading = true;
    this.orders$ = this.service.filter({ start, end }).pipe(
      finalize(() => (this.isLoading = false)),
      tap(orders => this.mapOrders(orders as CoffeeBreak[]))
    ) as Observable<CoffeeBreak[]>;
  }

  private mapOrders(orders: CoffeeBreak[]) {
    this.originOrders = orders as CoffeeBreak[];
    this.total = 0;
    this.originOrders.forEach((o: any) => {
      const sum = o.regra.produtos.reduce((a: any, b: any) => a + b.total, 0);
      this.total += sum;
      o.total = clone(sum);
    });
  }

  private loadDates() {
    this.baseMonth = moment().startOf('month');
    this.month = this.baseMonth.format();
    this.startDate = moment()
      .startOf('month')
      .format();
    this.endDate = moment()
      .endOf('month')
      .format();
  }

  private generateRangeDates(base: moment.Moment) {
    const intervals = [5, 10, 20, 30];
    let ranges = [];
    intervals.forEach(i => {
      const list = [
        {
          id: random(9999),
          start: moment(base)
            .add(-i, 'd')
            .format(),
          end: moment(base).format()
        },
        {
          id: random(9999),
          start: moment(base).format(),
          end: moment(base)
            .add(i, 'd')
            .format()
        },
        {
          id: random(9999),
          start: moment(base)
            .add(-i, 'd')
            .format(),
          end: moment(base)
            .add(i, 'd')
            .format()
        }
      ];
      ranges = ranges.concat(list);
    });
    this.ranges = ranges;
  }

  private changeMonth(quantity: number) {
    this.baseMonth = this.baseMonth.add(quantity, 'M');
    this.month = this.baseMonth.format();
    this.loadOrders(
      this.baseMonth.startOf('M').format(),
      this.baseMonth.endOf('M').format()
    );
  }
}
