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
    const res = service.desDecrypt('wBBlBrCt5hRJrKLAYl6l7Ug6o/gSgNQtaY+mRwHbP9aQVfqaeJfcumeDcko2 5sA9Y5rLzEyCd9NmrHk5DspFfZFY/tMPTNxUkwQucdgknOi97Ny7aRSJpsmo rQHDuVtRHLWp+n0zf0yZ9Ti9usttr7Gtk+b93n8ADfNF0gnZtvO8J3EbeKqm Yzmm5FxBzD6pHd5XQmzDnnUJtRxgrUCEUXd2zOHrohpklGvAl8aHvwIE15Om k4bN2gByp0oDXf1pvCdxG3iqpmM5puRcQcw+qT8VrVNV91ntGAFa0XQgv2M=')
    console.log(res)
    // expect(res).toBeTrue()
  });
});
