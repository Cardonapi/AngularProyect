import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiePaymentMethodsComponent } from './pie-payment-methods.component';

describe('PiePaymentMethodsComponent', () => {
  let component: PiePaymentMethodsComponent;
  let fixture: ComponentFixture<PiePaymentMethodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PiePaymentMethodsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PiePaymentMethodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
