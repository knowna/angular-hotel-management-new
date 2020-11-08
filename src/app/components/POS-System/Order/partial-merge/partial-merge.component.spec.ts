import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartialMergeComponent } from './partial-merge.component';

describe('PartialMergeComponent', () => {
  let component: PartialMergeComponent;
  let fixture: ComponentFixture<PartialMergeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartialMergeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartialMergeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
