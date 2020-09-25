import {Component, ElementRef, Injector, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {Overlay} from '@angular/cdk/overlay';
import {BeeService} from '../bee/bee.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {EventTitleComponent} from '../event-title/event-title.component';
import {EventComponent} from '../event/event.component';
import {CalendarComponent} from '../calendar/calendar.component';

@Component({
  selector: 'app-home-calendar',
  templateUrl: './home-calendar.component.html',
  styleUrls: ['./home-calendar.component.css']
})
export class HomeCalendarComponent implements OnInit {


  @ViewChild(EventTitleComponent)
  eventTitleComponent: EventTitleComponent
  @ViewChild(EventComponent)
  eventComponent: EventComponent
  @ViewChild(CalendarComponent)
  calendarComponent: CalendarComponent


  constructor(public overlay: Overlay, private viewContainerRef: ViewContainerRef, private elementRef: ElementRef,
              private beeService: BeeService, private snackBar: MatSnackBar, private injector: Injector) {
  }

  ngOnInit(): void {
  }


}
