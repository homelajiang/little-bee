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

  constructor(public overlay: Overlay, private viewContainerRef: ViewContainerRef) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {


  }

  createMission(element: any) {
    if (this.overlayRef && this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
    } else {
      const positionStrategy = this.overlay.position()
        .flexibleConnectedTo(this.originFab._elementRef)
        .withPositions([
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top'
          }
        ]);

      this.overlayRef = this.overlay.create({
        positionStrategy,
        scrollStrategy: this.overlay.scrollStrategies.reposition(),
        // direction: this.dir.valid,
        // minHeight: 100,
        hasBackdrop: true
      });
      this.overlayRef.attach(new ComponentPortal(NewTodoComponent, this.viewContainerRef));
    }
  }

  newMission(element: any) {
    element = element.target;
    // const viewPortHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    // const isBelowMax = viewPortHeight <= 300;
    // const maxHeight = isBelowMax ? viewPortHeight : 300;
    const overlayRef = this.overlay.create({
      hasBackdrop: false,
      positionStrategy: this.getFlexiblePosition(element),
      // positionStrategy: positionStrategy,
      // height: viewPortHeight,
      // minHeight: viewPortHeight,
      // height: viewPortHeight,
      // width: '200px',
      maxHeight: 300,
    });
    const popupComponentPortal = new ComponentPortal(NewTodoComponent);
    const componentRef = overlayRef.attach(popupComponentPortal);
  }


  getFlexiblePosition(element: any) {
    return this.overlay.position().flexibleConnectedTo(element._elementRef)
      .withLockedPosition()
      // .withFlexibleDimensions(true)
      .withPush(true)
      .withPositions([
        {
          panelClass: 'custom-panel1',
          originX: 'start',
          originY: 'top',
          overlayX: 'end',
          overlayY: 'top',
        },
        {
          panelClass: 'custom-panel2',
          originX: 'center',
          originY: 'center',
          overlayX: 'start',
          overlayY: 'center',
        },
        {
          panelClass: 'custom-panel3',
          originX: 'center',
          originY: 'center',
          overlayX: 'start',
          overlayY: 'bottom',
        },
      ]);
  }
}
