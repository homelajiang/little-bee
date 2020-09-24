import {Component, ElementRef, Injector, OnInit, ViewContainerRef} from '@angular/core';
import {Overlay} from '@angular/cdk/overlay';
import {BeeService} from '../bee/bee.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-home-calendar',
  templateUrl: './home-calendar.component.html',
  styleUrls: ['./home-calendar.component.css']
})
export class HomeCalendarComponent implements OnInit {

  private today: Date = new Date(); // 今天的日期
  public weekdaysSimple = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']


  constructor(public overlay: Overlay, private viewContainerRef: ViewContainerRef, private elementRef: ElementRef,
              private beeService: BeeService, private snackBar: MatSnackBar, private injector: Injector) {
  }

  ngOnInit(): void {
  }

}
