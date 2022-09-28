import { TestBed } from '@angular/core/testing';

import { UtileService } from './utile.service';

describe('UtilService', () => {
  let service: UtileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
