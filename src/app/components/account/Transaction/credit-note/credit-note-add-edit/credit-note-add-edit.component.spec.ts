import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditNoteAddEditComponent } from './credit-note-add-edit.component';

describe('CreditNoteAddEditComponent', () => {
  let component: CreditNoteAddEditComponent;
  let fixture: ComponentFixture<CreditNoteAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditNoteAddEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditNoteAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
