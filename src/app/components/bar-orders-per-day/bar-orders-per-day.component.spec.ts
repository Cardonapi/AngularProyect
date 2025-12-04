import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarOrdersPerDayComponent } from './bar-orders-per-day.component';

describe('BarOrdersPerDayComponent', () => {
  let component: BarOrdersPerDayComponent;
  let fixture: ComponentFixture<BarOrdersPerDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarOrdersPerDayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarOrdersPerDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
