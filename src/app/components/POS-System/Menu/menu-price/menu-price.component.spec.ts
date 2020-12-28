import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuPriceComponent } from './menu-price.component';

describe('MenuPriceComponent', () => {
  let component: MenuPriceComponent;
  let fixture: ComponentFixture<MenuPriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuPriceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
