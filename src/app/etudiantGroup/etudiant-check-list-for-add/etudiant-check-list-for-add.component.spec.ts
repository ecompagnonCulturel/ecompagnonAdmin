import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtudiantCheckListForAddComponent } from './etudiant-check-list-for-add.component';

describe('ListEtudiantComponent', () => {
  let component: EtudiantCheckListForAddComponent;
  let fixture: ComponentFixture<EtudiantCheckListForAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EtudiantCheckListForAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EtudiantCheckListForAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
