import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTaskPageComponent } from './create-task-page.component';

describe('CreateTaskPageComponent', () => {
  let component: CreateTaskPageComponent;
  let fixture: ComponentFixture<CreateTaskPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTaskPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTaskPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
