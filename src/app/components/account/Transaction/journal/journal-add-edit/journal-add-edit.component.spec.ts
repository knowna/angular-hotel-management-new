import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalAddEditComponent } from './journal-add-edit.component';

describe('JournalAddEditComponent', () => {
  let component: JournalAddEditComponent;
  let fixture: ComponentFixture<JournalAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JournalAddEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JournalAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
