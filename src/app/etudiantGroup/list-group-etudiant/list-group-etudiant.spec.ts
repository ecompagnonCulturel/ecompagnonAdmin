import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListGroupEtudiantComponent } from './list-group-etudiant.component';

describe('ListEtudiantGroupComponent', () => {
  let component: ListGroupEtudiantComponent;
  let fixture: ComponentFixture<ListGroupEtudiantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListGroupEtudiantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListGroupEtudiantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
