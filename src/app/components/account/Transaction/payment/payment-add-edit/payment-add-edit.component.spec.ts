import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentAddEditComponent } from './payment-add-edit.component';

describe('PaymentAddEditComponent', () => {
  let component: PaymentAddEditComponent;
  let fixture: ComponentFixture<PaymentAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentAddEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
