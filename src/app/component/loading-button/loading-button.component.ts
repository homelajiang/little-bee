import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-loading-button',
  templateUrl: './loading-button.component.html',
  styleUrls: ['./loading-button.component.css']
})
export class LoadingButtonComponent {

  @Output()
  action = new EventEmitter()

  @Input()
  tooltip = ''
  @Input()
  disabled = false
  @Input()
  buttonText = 'Button'
  @Input()
  loading = false

}
