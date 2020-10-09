import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-action-card',
  templateUrl: './action-card.component.html',
  styleUrls: ['./action-card.component.css']
})
export class ActionCardComponent implements OnInit {

  @Input()
  title: string
  @Input()
  desc: string
  @Input()
  readonly: boolean
  @Input()
  buttonText: string
  @Input()
  showButton = true
  @Input()
  icon: string

  @Output()
  actionClick = new EventEmitter()

  constructor() {
  }

  ngOnInit(): void {
  }

}
