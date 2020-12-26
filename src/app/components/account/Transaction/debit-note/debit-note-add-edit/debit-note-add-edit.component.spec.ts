import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebitNoteAddEditComponent } from './debit-note-add-edit.component';

describe('DebitNoteAddEditComponent', () => {
  let component: DebitNoteAddEditComponent;
  let fixture: ComponentFixture<DebitNoteAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DebitNoteAddEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DebitNoteAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
