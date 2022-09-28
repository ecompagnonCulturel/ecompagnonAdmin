import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListIntentionComponent } from './list-intention.component';

describe('ListIntensionComponent', () => {
  let component: ListIntentionComponent;
  let fixture: ComponentFixture<ListIntentionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListIntentionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListIntentionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
