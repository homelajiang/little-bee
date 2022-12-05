import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardDiningComponent } from './card-dining.component';

describe('CardDiningComponent', () => {
  let component: CardDiningComponent;
  let fixture: ComponentFixture<CardDiningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardDiningComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardDiningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
