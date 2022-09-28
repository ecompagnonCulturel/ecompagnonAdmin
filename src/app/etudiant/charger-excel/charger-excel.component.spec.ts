import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargerExcelComponent } from './charger-excel.component';

describe('ChargerExcelComponent', () => {
  let component: ChargerExcelComponent;
  let fixture: ComponentFixture<ChargerExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChargerExcelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargerExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
