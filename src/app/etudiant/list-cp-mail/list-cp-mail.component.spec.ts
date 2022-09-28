import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCpMailComponent } from './list-cp-mail.component';

describe('ListCpMailComponent', () => {
  let component: ListCpMailComponent;
  let fixture: ComponentFixture<ListCpMailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCpMailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCpMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
