import { TestBed } from '@angular/core/testing';

import { BeeService } from './bee.service';

describe('BeeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BeeService = TestBed.get(BeeService);
    expect(service).toBeTruthy();
  });
});
