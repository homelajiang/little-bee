import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ElementRef, Injector,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {ComponentPortal, TemplatePortal} from '@angular/cdk/portal';
import {CdkOverlayOrigin, Overlay, OverlayRef} from '@angular/cdk/overlay';
import {MatButton} from '@angular/material';
import {NewTodoComponent} from '../new-todo/new-todo.component';

@Component({
  selector: 'app-daily',
  templateUrl: './daily.component.html',
  styleUrls: ['./daily.component.css']
})
export class DailyComponent implements OnInit, AfterViewInit {
  @ViewChild('originFab', {static: false}) originFab: MatButton;
  private overlayRef: OverlayRef;

  constructor(public overlay: Overlay, private viewContainerRef: ViewContainerRef, private elementRef: ElementRef) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {


  }

  newMission(event: any) {
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
    const popupComponentPortal = new ComponentPortal(NewTodoComponent);
    this.overlayRef.attach(popupComponentPortal);
    this.overlayRef.backdropClick().subscribe(() => this.overlayRef.dispose());
  }

  getFlexiblePosition(element: any) {
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
}
