import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarDriversActivityComponent } from './bar-drivers-activity.component';

describe('BarDriversActivityComponent', () => {
  let component: BarDriversActivityComponent;
  let fixture: ComponentFixture<BarDriversActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarDriversActivityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarDriversActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
