import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangelogPageComponent } from './changelog-page.component';

describe('ChangelogPageComponent', () => {
  let component: ChangelogPageComponent;
  let fixture: ComponentFixture<ChangelogPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangelogPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangelogPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
