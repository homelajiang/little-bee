import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClockInComponent } from './clock-in.component';

describe('ClockInComponent', () => {
  let component: ClockInComponent;
  let fixture: ComponentFixture<ClockInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClockInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClockInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
