import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEtudiantGroupComponent } from './add-etudiant-group.component';

describe('AddEtudiantGroupComponent', () => {
  let component: AddEtudiantGroupComponent;
  let fixture: ComponentFixture<AddEtudiantGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEtudiantGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEtudiantGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
