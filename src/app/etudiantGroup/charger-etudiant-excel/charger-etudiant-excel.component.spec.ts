import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargerEtudiantExcelComponent } from './charger-etudiant-excel.component';

describe('ChargerComponent', () => {
  let component: ChargerEtudiantExcelComponent;
  let fixture: ComponentFixture<ChargerEtudiantExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChargerEtudiantExcelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargerEtudiantExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
