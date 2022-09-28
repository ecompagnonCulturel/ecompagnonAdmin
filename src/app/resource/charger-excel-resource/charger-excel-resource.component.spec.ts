import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargerExcelResourceComponent } from './charger-excel-resource.component';

describe('ChargerExcelComponent', () => {
  let component: ChargerExcelResourceComponent;
  let fixture: ComponentFixture<ChargerExcelResourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChargerExcelResourceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargerExcelResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
