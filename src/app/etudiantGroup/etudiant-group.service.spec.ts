import { TestBed } from '@angular/core/testing';

import { EtudiantGroupService } from './etudiant-group.service';

describe('EtudiantGroupService', () => {
  let service: EtudiantGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EtudiantGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
