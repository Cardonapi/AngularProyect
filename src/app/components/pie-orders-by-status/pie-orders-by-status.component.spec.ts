import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieOrdersByStatusComponent } from './pie-orders-by-status.component';

describe('PieOrdersByStatusComponent', () => {
  let component: PieOrdersByStatusComponent;
  let fixture: ComponentFixture<PieOrdersByStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PieOrdersByStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PieOrdersByStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
