import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { CoffeeBreak } from '../../models/coffee-break';
import { CoffeeBreakService } from '../../services/coffee-break.service';
import { takeWhile, map } from 'rxjs/operators';

@Component({
  selector: 'app-amount-of-people-and-cup',
  templateUrl: './amount-of-people-and-cup.component.html',
  styleUrls: ['./amount-of-people-and-cup.component.scss']
})
export class AmountOfPeopleAndCupComponent implements OnInit, OnDestroy {
  order: CoffeeBreak;
  rules: any[] = [];
  private _rangeItem: any;
  public get rangeItem(): any {
    return this._rangeItem;
  }
  @Input()
  public set rangeItem(v: any) {
    if (!v) {
      this._rangeItem = {
        qtdPessoasMin: 0,
        qtdPessoasMax: 0,
        qtdCopos: 0
      };
    } else {
      this._rangeItem = v;
    }
  }

  @Output() changeRange = new EventEmitter<any>();
  inRange = (min, max) => {
    if (!this.rangeItem) {
      return false;
    }
    return this.rangeItem.qtdPessoasMax >= max;
  };
  private componentActive = true;
  constructor(
    private modalView: ModalController,
    private service: CoffeeBreakService
  ) {}

  ngOnDestroy() {
    this.componentActive = false;
  }

  ngOnInit() {
    this.rangeItem = {
      qtdPessoasMin: 1,
      qtdPessoasMax: 10,
      qtdCopos: 3
    };
    this.loadRules();
  }

  loadRules() {
    const rule = qtdPessoaMax => {
      const icons = {
        1: 'pessoa-one',
        2: 'pessoa-two',
        3: 'pessoa-three',
        4: 'pessoa-four'
      };
      if (qtdPessoaMax <= 10) {
        return icons[1];
      }
      if (qtdPessoaMax <= 20) {
        return icons[2];
      }
      if (qtdPessoaMax <= 30) {
        return icons[3];
      }
      if (qtdPessoaMax > 30) {
        return icons[4];
      }
    };
    this.service
      .getRules()
      .pipe(
        map(rules => rules.map(r => ({ ...r, icon: rule(r.qtdPessoasMax) }))),
        takeWhile(() => this.componentActive)
      )
      .subscribe(rules => {
        this.rangeItem = {
          ...rules[0]
        };
        this.rules = rules;
      });
  }

  range(min: number, max: number, cups: number) {
    this.rangeItem.qtdPessoasMin = min;
    this.rangeItem.qtdPessoasMax = max;
    this.rangeItem.qtdCopos = cups;
    this.changeRange.next(this.rangeItem);
    console.log('actual range ', this.rangeItem);
  }

  cancel() {
    this.modalView.dismiss();
  }

  onChange($event: any) {
    const cups = $event.detail.value as number;
    this.range(
      this.rangeItem.qtdPessoasMin,
      this.rangeItem.qtdPessoasMax,
      cups
    );
  }
}
