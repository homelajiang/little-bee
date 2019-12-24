import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderMealComponent } from './order-meal.component';

describe('OrderMealComponent', () => {
  let component: OrderMealComponent;
  let fixture: ComponentFixture<OrderMealComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderMealComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderMealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
