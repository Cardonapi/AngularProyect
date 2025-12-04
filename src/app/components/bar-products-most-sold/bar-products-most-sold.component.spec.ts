import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarProductsMostSoldComponent } from './bar-products-most-sold.component';

describe('BarProductsMostSoldComponent', () => {
  let component: BarProductsMostSoldComponent;
  let fixture: ComponentFixture<BarProductsMostSoldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarProductsMostSoldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarProductsMostSoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
