import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyListComponent } from './daily-list.component';

describe('DailyListComponent', () => {
  let component: DailyListComponent;
  let fixture: ComponentFixture<DailyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
