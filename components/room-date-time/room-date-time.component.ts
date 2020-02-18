import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CoffeeBreakService } from '../../services/coffee-break.service';
import { Observable } from 'rxjs';
import { Rooms } from '../../models/rooms';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-room-date-time',
  templateUrl: './room-date-time.component.html',
  styleUrls: ['./room-date-time.component.scss']
})
export class RoomDateTimeComponent implements OnInit {
  @Input() rooms: Rooms[];
  selectedRoom: any;

  constructor(private modalView: ModalController) {}

  ngOnInit() {}

  onSelect(room: any) {
    this.rooms.forEach(u => (u.selected = false));
    room.selected = true;
    this.selectedRoom = this.rooms.find(x => x.id === room.id);
  }

  change() {
    this.modalView.dismiss(this.selectedRoom);
  }

  cancel() {
    this.modalView.dismiss();
  }
}
