import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardWorkingHoursComponent } from './card-working-hours.component';

describe('CardWorkingHoursComponent', () => {
  let component: CardWorkingHoursComponent;
  let fixture: ComponentFixture<CardWorkingHoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardWorkingHoursComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardWorkingHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
