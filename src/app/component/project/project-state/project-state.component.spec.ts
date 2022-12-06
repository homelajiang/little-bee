import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectStateComponent } from './project-state.component';

describe('ProjectStateComponent', () => {
  let component: ProjectStateComponent;
  let fixture: ComponentFixture<ProjectStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectStateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
