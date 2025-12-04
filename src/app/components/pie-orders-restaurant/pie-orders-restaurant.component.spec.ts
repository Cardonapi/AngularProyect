import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieOrdersRestaurantComponent } from './pie-orders-restaurant.component';

describe('PieOrdersRestaurantComponent', () => {
  let component: PieOrdersRestaurantComponent;
  let fixture: ComponentFixture<PieOrdersRestaurantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PieOrdersRestaurantComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PieOrdersRestaurantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
