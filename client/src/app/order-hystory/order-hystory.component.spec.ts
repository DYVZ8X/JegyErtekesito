import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderHystoryComponent } from './order-hystory.component';

describe('OrderHystoryComponent', () => {
  let component: OrderHystoryComponent;
  let fixture: ComponentFixture<OrderHystoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderHystoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderHystoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
