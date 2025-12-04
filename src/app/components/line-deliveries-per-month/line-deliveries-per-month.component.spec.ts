import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineDeliveriesPerMonthComponent } from './line-deliveries-per-month.component';

describe('LineDeliveriesPerMonthComponent', () => {
  let component: LineDeliveriesPerMonthComponent;
  let fixture: ComponentFixture<LineDeliveriesPerMonthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineDeliveriesPerMonthComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineDeliveriesPerMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
