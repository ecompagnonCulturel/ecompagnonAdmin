import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentListAddedComponent } from './student-list-added.component';

describe('StudentListAddedComponent', () => {
  let component: StudentListAddedComponent;
  let fixture: ComponentFixture<StudentListAddedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentListAddedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentListAddedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
