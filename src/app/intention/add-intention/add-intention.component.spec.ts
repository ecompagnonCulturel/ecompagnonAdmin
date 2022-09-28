import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIntentionComponent } from './add-intention.component';

describe('AddIntentionComponent', () => {
  let component: AddIntentionComponent;
  let fixture: ComponentFixture<AddIntentionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddIntentionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddIntentionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
