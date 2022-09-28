import { TestBed } from '@angular/core/testing';

import { IntensionService } from './intension.service';

describe('IntensionService', () => {
  let service: IntensionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntensionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
