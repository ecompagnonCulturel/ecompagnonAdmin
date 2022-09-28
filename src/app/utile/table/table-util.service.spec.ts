import { TestBed } from '@angular/core/testing';

import { TableUtilService } from './table-util.service';

describe('TableUtilService', () => {
  let service: TableUtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TableUtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
