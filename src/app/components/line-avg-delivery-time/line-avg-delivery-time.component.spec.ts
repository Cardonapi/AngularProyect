import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineAvgDeliveryTimeComponent } from './line-avg-delivery-time.component';

describe('LineAvgDeliveryTimeComponent', () => {
  let component: LineAvgDeliveryTimeComponent;
  let fixture: ComponentFixture<LineAvgDeliveryTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineAvgDeliveryTimeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineAvgDeliveryTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
