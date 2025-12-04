import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineIncomePerMonthComponent } from './line-income-per-month.component';

describe('LineIncomePerMonthComponent', () => {
  let component: LineIncomePerMonthComponent;
  let fixture: ComponentFixture<LineIncomePerMonthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineIncomePerMonthComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineIncomePerMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
