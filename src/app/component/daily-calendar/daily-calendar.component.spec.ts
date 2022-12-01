import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyCalendarComponent } from './daily-calendar.component';

describe('DailyCalendarComponent', () => {
  let component: DailyCalendarComponent;
  let fixture: ComponentFixture<DailyCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyCalendarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
