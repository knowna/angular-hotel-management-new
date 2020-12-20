import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContraAddEditComponent } from './contra-add-edit.component';

describe('ContraAddEditComponent', () => {
  let component: ContraAddEditComponent;
  let fixture: ComponentFixture<ContraAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContraAddEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContraAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
