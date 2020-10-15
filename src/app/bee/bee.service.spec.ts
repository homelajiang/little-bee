import {getTestBed, TestBed} from '@angular/core/testing';

import {BeeService} from './bee.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';

describe('BeeService', () => {
  let service: BeeService
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [BeeService]
    })
    service = TestBed.get(BeeService)
    // expect(service).toBeTruthy();
  });

  it('decodeMsg', () => {
    const res = service.desDecrypt('JgBrfgPYxP4aOGKHvOFyrde4fcytf7uPJeXMmT0oMpPwMtoNAOrw2Z84tZuv AoJdtSO23/a3zgRTWFOyodunHW0ONCci2YH2qPCTjtANWt/lnD9kG2fM35tW A/7PWUqleqQxcowwhsmOxtLU2nJ7Xw==')
    console.log(res)
    // expect(res).toBeTrue()
  });
});
