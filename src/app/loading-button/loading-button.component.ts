import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-loading-button',
  templateUrl: './loading-button.component.html',
  styleUrls: ['./loading-button.component.css']
})
export class LoadingButtonComponent implements OnInit {

  @Output()
  action = new EventEmitter()
  @Input()
  tooltip: string
  @Input()
  disabled: boolean
  @Input()
  buttonText: string
  @Input()
  loading:boolean

  constructor() {
  }

  ngOnInit(): void {
  }

}
