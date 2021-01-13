import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableMoveComponent } from './table-move.component';

describe('TableMoveComponent', () => {
  let component: TableMoveComponent;
  let fixture: ComponentFixture<TableMoveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableMoveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableMoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
