import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseAddEditComponent } from './purchase-add-edit.component';

describe('PurchaseAddEditComponent', () => {
  let component: PurchaseAddEditComponent;
  let fixture: ComponentFixture<PurchaseAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseAddEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
