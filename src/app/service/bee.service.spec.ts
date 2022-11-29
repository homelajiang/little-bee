import { TestBed } from '@angular/core/testing';

import { BeeService } from './bee.service';

describe('BeeService', () => {
  let service: BeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
