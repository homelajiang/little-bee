import {Component, ElementRef, Injector, Input, OnInit, ViewContainerRef} from '@angular/core';
import {BeeService, Daily, Task} from '../bee/bee.service';
import {ComponentPortal, PortalInjector} from '@angular/cdk/portal';
import {TaskInfoComponent} from '../task-info/task-info.component';
import {NewTaskComponent} from '../new-task/new-task.component';
import {Overlay, OverlayRef} from '@angular/cdk/overlay';
import {TASK_INFO} from '../tokens';
import {SnackBar} from '../utils/snack-bar';
import {format} from 'date-fns';
import {Config} from '../config';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  private overlayRef: OverlayRef;

  @Input() week: Array<Daily>
  public displayWeekdays = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']

  constructor(public overlay: Overlay, private viewContainerRef: ViewContainerRef, private elementRef: ElementRef,
              private beeService: BeeService, private snackBar: SnackBar, private injector: Injector,) {
  }

  ngOnInit(): void {
  }

  showEventInfo(event: any, task: Task) {
    this.createOverlayRef(event);
    const popupComponentPortal = new ComponentPortal(TaskInfoComponent, this.viewContainerRef,
      this.createInjector(task, this.overlayRef));
    this.overlayRef.attach(popupComponentPortal);
    this.overlayRef.backdropClick().subscribe(() => this.overlayRef.dispose());

    event.stopPropagation();
  }

  newEvent(event: any, date: Date) {
    this.createOverlayRef(event);
    const popupComponentPortal = new ComponentPortal(NewTaskComponent, this.viewContainerRef,
      this.createInjector({createTime: format(date, 'yyyy-MM-dd HH:mm:ss', Config.dateOptions)}, this.overlayRef));
    this.overlayRef.attach(popupComponentPortal);
    this.overlayRef.backdropClick().subscribe(() => this.overlayRef.dispose());
  }

  private createOverlayRef(event: any) {
    if (this.overlayRef && this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
    }
    const target = {
      getBoundingClientRect: (): ClientRect => ({
        bottom: event.clientY - event.offsetY + event.target.offsetHeight,
        height: 0,
        left: event.clientX - event.offsetX,
        right: event.clientX - event.offsetX + event.target.offsetWidth,
        top: event.clientY - event.offsetY,
        width: 0,
      }),
    };
    const element = new ElementRef(target);
    this.overlayRef = this.overlay.create({
      backdropClass: 'transparent-drop-bg',
      hasBackdrop: true,
      positionStrategy: this.getFlexiblePosition(element),
      maxHeight: 300,
    });
  }

  private createInjector(data: any, overlayRef: OverlayRef): PortalInjector {
    const injectorTokens = new WeakMap();
    injectorTokens.set(OverlayRef, overlayRef);
    injectorTokens.set(TASK_INFO, data);
    return new PortalInjector(this.injector, injectorTokens);
  }

  private getFlexiblePosition(element: any) {
    return this.overlay.position().flexibleConnectedTo(element)
      .withLockedPosition()
      // .withFlexibleDimensions(true)
      .withPush(true)
      .withPositions([
        {
          originX: 'end',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'top',
          offsetX: 10,
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'end',
          overlayY: 'top',
          offsetX: -10,
        },
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'bottom',
          offsetX: 10,
          offsetY: -10
        },
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'bottom',
          offsetX: -10,
          offsetY: -10
        }
      ]);
  }

  getStateDesc(task: Task) {
    switch (task.state) {
      case 2:
        if (task.type === 6) {
          return ''
        } else {
          return task.workHours + '小时'
        }
      case 3:
        return '已延期'
      default:
        return ''
    }
  }
}
