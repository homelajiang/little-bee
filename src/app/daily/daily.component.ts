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
  @ViewChild(CdkOverlayOrigin, {static: false}) overlayOrigin: CdkOverlayOrigin;
  @ViewChild('originFab', {static: false}) originFab: MatButton;
  private overlayTemplate;
  private overlayRef: OverlayRef;

  constructor(public overlay: Overlay, private viewContainerRef: ViewContainerRef,
              private componentFactoryResolver: ComponentFactoryResolver,
              private injector: Injector) {
  }

  ngOnInit() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(NewTodoComponent);
    this.overlayTemplate = componentFactory.create(this.injector);
  }

  ngAfterViewInit() {
    console.log(this.originFab);
    console.log(this.overlayOrigin);
    console.log(this.overlayTemplate);

    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo(this.originFab._elementRef)
      .withPositions([{
        originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'top'
      }]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      // direction: this.dir.valid,
      minWidth: 300,
      minHeight: 100,
      hasBackdrop: false
    });
  }

  createMission() {
    if (this.overlayRef && this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
    } else {
      this.overlayRef.attach(new TemplatePortal(this.overlayTemplate, this.viewContainerRef));
    }
  }
}
